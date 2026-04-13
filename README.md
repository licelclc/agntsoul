# FerryMind - AI人格摆渡

摆渡你的AI人格，让它自由迁移。

## 功能
- ✅ 人格上传（JSON文件）
- ✅ 人格列表展示
- ✅ 人格搜索
- ✅ 人格详情页
- ✅ 人格下载

## 技术栈
- 前端：Next.js 14
- 后端：Next.js API Routes
- 数据库：Supabase（PostgreSQL）
- 部署：Vercel

## 快速开始

```bash
# 安装依赖
npm install

# 本地运行
npm run dev

# 访问
open http://localhost:3000
```

## 部署到Vercel

1. 把代码推送到GitHub
2. 在Vercel导入项目
3. 配置Supabase环境变量
4. 自动部署完成

## 环境变量

在`.env.local`中配置：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
