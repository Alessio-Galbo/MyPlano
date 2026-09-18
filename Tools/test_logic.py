import unittest
import json
import os

class TestMyPlanoLogic(unittest.TestCase):
    def test_frequency_annual_costs(self):
        multipliers = {
            'monthly': 12,
            'bimonthly': 6,
            'quarterly': 4,
            'semiannual': 2,
            'annual': 1,
            'biennial': 0.5,
            'oneOff': 1
        }
        test_amount = 60.0
        self.assertEqual(test_amount * multipliers['monthly'], 720.0)
        self.assertEqual(test_amount * multipliers['biennial'], 30.0)
        self.assertEqual(test_amount * multipliers['annual'], 60.0)
        custom_mult = 12 / 4
        self.assertEqual(60.0 * custom_mult, 180.0)

    def test_cold_start_with_initial_balance(self):
        monthly_quota = 100.0
        outflows = [0.0, 1000.0]
        for init_bal, expected_deficit in [(0.0, 800.0), (500.0, 300.0), (900.0, 0.0)]:
            bal = init_bal
            min_bal = init_bal
            for out in outflows:
                bal += (monthly_quota - out)
                if bal < min_bal:
                    min_bal = bal
            deficit = abs(min_bal) if min_bal < 0 else 0.0
            self.assertEqual(deficit, expected_deficit)

    def test_survival_strategy_clears_all_deficits(self):
        outflows = [0, 234.90, 569.90, 164.80, 249.90, 114.90, 29.90, 114.90, 29.90, 114.90, 29.90, 144.80]
        std_quota = 149.89
        b0 = 0
        K = 5
        cum = 0
        min_Q = std_quota
        for m in range(1, len(outflows) + 1):
            cum += outflows[m - 1]
            req = (cum - b0) / m if m <= K else (cum - b0 - (m - K) * std_quota) / K
            if req > min_Q:
                min_Q = req
        self.assertAlmostEqual(min_Q, 268.27, places=2)
        sim = b0
        for i, o in enumerate(outflows):
            q = min_Q if i < K else std_quota
            sim += (q - o)
            self.assertGreaterEqual(sim, -0.01)

    def test_translation_keys_completeness(self):
        for domain in ['common', 'budget', 'expenses']:
            it_path = os.path.join('src', 'core', 'i18n', 'locales', 'it', f'{domain}.json')
            en_path = os.path.join('src', 'core', 'i18n', 'locales', 'en', f'{domain}.json')
            with open(it_path, 'r', encoding='utf-8') as f:
                it_b = json.load(f)
            with open(en_path, 'r', encoding='utf-8') as f:
                en_b = json.load(f)
            self.assertEqual(set(it_b.keys()), set(en_b.keys()))

    def test_quota_rounding_ceil_no_deficit(self):
        import math
        annual_total = 100.0
        monthly_quota = math.ceil((annual_total / 12.0) * 100.0) / 100.0
        self.assertEqual(monthly_quota, 8.34)
        annual_saved = monthly_quota * 12.0
        self.assertGreaterEqual(annual_saved, annual_total)
        self.assertAlmostEqual(annual_saved - annual_total, 0.08, places=2)

    def test_timeline_interim_grouping(self):
        # Verify interim collapse preserves exact financial balances
        quotas = [100.0, 100.0, 100.0]
        outflows = [30.0, 40.0, 50.0]
        init_res = 500.0
        cur_res = init_res
        for q, o in zip(quotas, outflows):
            cur_res += (q - o)
        # Grouped representation:
        grp_quota = sum(quotas)
        grp_outflow = sum(outflows)
        grp_end_res = init_res + grp_quota - grp_outflow
        self.assertEqual(cur_res, grp_end_res)
        self.assertEqual(grp_end_res, 680.0)

if __name__ == '__main__':
    unittest.main()
