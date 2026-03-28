# BizInsight Decision Support System

A premium, full-stack Next.js web application designed to help small businesses track sales, monitor expenses, and receive actionable, rule-based recommendations to improve profitability.

## Features

- **📊 Interactive Dashboard**: Real-time financial overview with KPI cards (Revenue, Profit, Margin), an area chart for Revenue vs. Expenses, a donut chart for product mix, and active inventory alerts.
- **📦 Product Management**: Full CRUD interface for tracking products, automatically calculating margins and highlighting low-stock items.
- **💸 Expense Tracking**: Categorized expense management with interactive distribution bars and a breakdown of recurring vs. one-time costs.
- **🤖 Recommendation Engine**: Rule-based AI that analyzes your data and provides prioritized, actionable insights (e.g., pricing optimization, low-inventory warnings, marketing spend adjustments).
- **🎨 Premium UI/UX**: A state-of-the-art dark mode design featuring glassmorphism, smooth animations, and interactive data visualization.

## Technologies Used

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS Variables (Custom dark glassmorphism system)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd decision-support-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to the `/dashboard`.

## Usage & Demo Mode

Currently, the application runs with an **In-Memory Data Store** (`lib/data-store.ts`). This allows you to interact with the full CRUD capabilities of the application without setting up a database.

**Note:** Because the data is stored in memory, any new products or expenses you add will be reset to the default seed data whenever the development server is restarted.

## Deployment

This Next.js application is ready to be deployed on platforms like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

To build the production bundle:
```bash
npm run build
npm run start
```

## Future Enhancements
- Transition from the in-memory data store to a persistent database (e.g., PostgreSQL with Prisma).
- Implement user authentication for multi-tenant support.
- Expand the recommendation engine with more advanced predictive models.
