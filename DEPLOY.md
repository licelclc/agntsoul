# AI人格市场 MVP 部署指南

## 第一步：注册Supabase（免费）

1. 访问 https://supabase.com
2. 注册账号并创建新项目
3. 记录以下信息：
   - Project URL
   - anon public key
   - service_role key（在 Settings > API 中）

## 第二步：创建数据库表

1. 在Supabase项目中，进入 SQL Editor
2. 复制 `database/schema.sql` 的内容
3. 执行SQL创建表结构

## 第三步：部署到Vercel（免费）

### 方法一：通过Vercel Dashboard（推荐）

1. 访问 https://vercel.com
2. 注册/登录账号
3. 点击 "Add New Project"
4. 导入你的GitHub仓库
5. 配置环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
   SUPABASE_SERVICE_ROLE_KEY=你的service_role_key
   ```
6. 点击 Deploy

### 方法二：本地开发

```bash
# 克隆项目
git clone 你的仓库地址
cd personality-market-mvp

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env.local
# 编辑 .env.local 填入你的配置

# 本地运行
npm run dev

# 访问 http://localhost:3000
```

## 第四步：初始化示例数据

上传准备好的示例人格JSON文件：
- `../示例人格/丢丢_调酒助理.json`
- `../示例人格/福尔摩斯_侦探顾问.json`
- `../示例人格/摸鱼仔_消极助手.json`
- `../示例人格/钢铁侠_天才发明家.json`

## 常见问题

### Q: 为什么看不到人格列表？
A: 检查Supabase的RLS策略是否正确配置

### Q: 上传失败？
A: 确保JSON格式正确，且personality_id不重复

### Q: 如何绑定自定义域名？
A: 在Vercel项目设置中添加域名，然后在域名服务商配置DNS

## 成本估算

- Supabase免费版：每月500MB数据库，足够MVP使用
- Vercel免费版：每月100GB流量，足够MVP使用
- 总成本：**¥0/月**（只需要域名费用约¥50/年）
