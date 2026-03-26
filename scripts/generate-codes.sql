-- 批量生成激活码
-- 在 Supabase SQL Editor 中执行
-- 修改 generate_series 的参数来控制生成数量（下面生成 10 个）
-- 修改 expires_at 来设置激活码过期时间（下面设为 1 年后过期）

INSERT INTO activation_codes (code, plan, duration_days, expires_at)
SELECT
  -- 生成 XXXX-XXXX-XXXX-XXXX 格式的随机码
  upper(
    substr(md5(random()::text), 1, 4) || '-' ||
    substr(md5(random()::text), 1, 4) || '-' ||
    substr(md5(random()::text), 1, 4) || '-' ||
    substr(md5(random()::text), 1, 4)
  ) AS code,
  'premium' AS plan,
  365 AS duration_days,
  NOW() + INTERVAL '1 year' AS expires_at
FROM generate_series(1, 10);

-- 查看刚生成的激活码
SELECT code, plan, duration_days, expires_at
FROM activation_codes
WHERE is_used = FALSE
ORDER BY created_at DESC
LIMIT 20;
