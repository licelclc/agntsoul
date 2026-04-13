-- AI人格市场数据库表结构
-- 在Supabase SQL Editor中执行

-- 人格表
CREATE TABLE personalities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personality_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  display_name TEXT,
  role TEXT,
  avatar_url TEXT,
  description TEXT,
  
  -- 人格核心数据（JSONB存储完整人格）
  personality_data JSONB NOT NULL,
  
  -- 元数据
  type TEXT DEFAULT 'public', -- public, private, paid
  source TEXT DEFAULT 'constructed', -- constructed, cultivated, distilled, ip_licensed
  tags TEXT[] DEFAULT '{}',
  version TEXT DEFAULT '1.0.0',
  license TEXT DEFAULT 'CC-BY-SA',
  
  -- 统计
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_personalities_tags ON personalities USING GIN(tags);
CREATE INDEX idx_personalities_type ON personalities(type);
CREATE INDEX idx_personalities_created_at ON personalities(created_at DESC);

-- 全文搜索索引（简化版，只索引name和description）
CREATE INDEX idx_personalities_search ON personalities 
USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_personalities_updated_at
  BEFORE UPDATE ON personalities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS策略（行级安全）
ALTER TABLE personalities ENABLE ROW LEVEL SECURITY;

-- 公开人格对所有人可见
CREATE POLICY "Public personalities are viewable by everyone"
  ON personalities FOR SELECT
  USING (type = 'public');

-- 插入权限（暂时允许匿名，后续可加用户认证）
CREATE POLICY "Anyone can insert personalities"
  ON personalities FOR INSERT
  WITH CHECK (true);
