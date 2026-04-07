import { NextResponse } from 'next/server';
import { getEukaTests, getEmailTests } from '@/lib/sheets';
import { percentDiff } from '@/lib/parse';
import { DashboardSummary, EukaTest } from '@/lib/types';

export const revalidate = 60;

export async function GET() {
  try {
    const [eukaTests, emailTests] = await Promise.all([
      getEukaTests(),
      getEmailTests(),
    ]);

    const allTests = [...eukaTests, ...emailTests];
    const activeTests = allTests.filter((t) => t.status === 'running');
    const completedTests = allTests.filter((t) => t.status === 'completed');

    // Find best performer among completed tests
    let bestPerformer: DashboardSummary['bestPerformer'] = null;
    let maxImprovement = 0;

    for (const test of completedTests) {
      if (!test.winner || test.winner === 'none') continue;

      if ('variantA' in test && 'reached' in (test as EukaTest).variantA) {
        const euka = test as EukaTest;
        const aRevPerCreator = euka.variantA.reached > 0 ? euka.variantA.revenue / euka.variantA.reached : 0;
        const bRevPerCreator = euka.variantB.reached > 0 ? euka.variantB.revenue / euka.variantB.reached : 0;
        const improvement = Math.abs(percentDiff(
          test.winner === 'variant_a' ? aRevPerCreator : bRevPerCreator,
          test.winner === 'variant_a' ? bRevPerCreator : aRevPerCreator
        ));
        if (improvement > maxImprovement) {
          maxImprovement = improvement;
          bestPerformer = {
            testName: test.testName,
            metric: 'Revenue/Creator',
            improvement: `+${improvement.toFixed(0)}%`,
          };
        }
      }
    }

    const summary: DashboardSummary = {
      totalTests: allTests.length,
      activeTests: activeTests.length,
      completedTests: completedTests.length,
      avgImprovementPercent: maxImprovement,
      bestPerformer,
    };

    return NextResponse.json({ summary, eukaTests, emailTests });
  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
