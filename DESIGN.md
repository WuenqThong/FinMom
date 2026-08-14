# DESIGN — FinMom (framer-friendly-forge)

Tài liệu tổng hợp **UI/UX, design system, theme và pattern triển khai** trong repository hiện tại (`Vite` + `React 18` + `TypeScript` + `Tailwind CSS` + **shadcn/ui** + **Radix UI**).

---

## 1. Tổng quan kiến trúc UI

| Lớp | Công nghệ | Ghi chú |
|-----|-----------|---------|
| Styling | Tailwind 3.4, `tailwindcss-animate` | `darkMode: ["class"]` — bật class `.dark` trên root nếu cần |
| Design tokens | CSS variables trong `src/index.css` (`:root`, `.dark`) | Mọi màu theo chuẩn **HSL không có `hsl()`**, dùng `hsl(var(--token))` |
| Components | shadcn/ui (`components.json`, base **slate**, `cssVariables: true`) | Variant qua `class-variance-authority`, merge class qua `cn()` |
| Primitives | Radix (dialog, menu, accordion, …) | Hỗ trợ focus trap, keyboard, WAI-ARIA cơ bản |
| Icons | `lucide-react` | Kích thước thường `h-4 w-4`–`h-5 w-5`, đồng bộ với button `[&_svg]` |
| Charts | `recharts` + `src/components/ui/chart.tsx` | Map màu series qua `--color-*`, hỗ trợ selector `.dark` |
| Toasts | `@radix-ui/react-toast` + `sonner` | Radix toaster + Sonner (Sonner dùng `next-themes` — xem mục 8) |
| Routing | `react-router-dom` | `NavLink` bọc `RouterNavLink` + `cn` cho active state |

**Luồng trang chính:** Landing và marketing dùng `src/components/cryptix/FinMomPage.tsx` (brand **FinMom**). Trang trading và workspace dùng cùng nhận diện **FinMom** (`FinMomWordmark` / `BrandLogoLink`) và lớp `.trading-root`. Đăng nhập/đăng ký dùng lớp tiền tố `auth-*`.

---

## 2. Typography (chữ)

### 2.1 Font

| Vai trò | Font | Nguồn |
|---------|------|--------|
| Mặc định toàn app (`body`) | **Onest** | Google Fonts, import trong `src/index.css` |
| Sans mở rộng Tailwind | `font-sans` → Onest stack | `tailwind.config.ts` → `theme.extend.fontFamily.sans` |
| Tiêu đề / marketing | **Manrope** | `font-manrope` trong `tailwind.config.ts`; FinMom page gốc: `font-manrope` |

### 2.2 Thang đo chữ (nhìn từ code)

- **Hero:** `text-5xl` → `md:text-7xl`, `font-medium`, `tracking-tight`, `leading-[1.05]`, `text-balance`.
- **Section H2:** `text-3xl md:text-5xl`, `font-semibold`.
- **Phụ đề / body lớn:** `text-lg` → `md:text-2xl` hoặc `text-muted-foreground`.
- **Nav / UI nhỏ:** `text-sm`, label phụ `text-[11px]` uppercase + `tracking-wider` (mega menu).
- **Trading / bảng:** nhiều `text-[9px]`, `text-[10px]`, `font-mono`, `tabular-nums` (trùng với utility `.trading-root`).

### 2.3 Số & bảng

- Class **`.trading-root`** đặt `font-variant-numeric: tabular-nums` và `-webkit-font-smoothing: antialiased` để bảng giữ cột số thẳng hàng.

---

## 3. Màu sắc & theme tokens

### 3.1 Nguyên tắc

- Token lưu dạng **HSL thuần** (ví dụ `--primary: 167 100% 48%;`), khi dùng: `hsl(var(--primary))` hoặc trong Tailwind: `bg-primary`, `text-primary`, v.v.
- **`:root` hiện là theme tối “premium”** (nền rất tối, accent xanh ngọc). Đây là giao diện mặc định khi chưa gắn class `.dark` lên `<html>` hoặc `<body>`.
- Khối **`.dark` trong `index.css`** là bộ token kiểu shadcn mặc định (foreground sáng hơn, primary trở thành gần trắng). **Ứng dụng chưa mount `ThemeProvider` từ `next-themes`**, nên thực tế người dùng chủ yếu thấy **`:root`**, trừ khi bạn tự toggle class.

### 3.2 Bảng token chính (`:root` — theme đang “active”)

| Token | HSL (giá trị trong file) | Ý nghĩa UX |
|-------|---------------------------|------------|
| `--background` | `232 70% 4%` | Nền trang gần đen xanh |
| `--foreground` | `210 18% 96%` | Chữ chính gần trắng |
| `--card` | `223 24% 10%` | Nền thẻ |
| `--primary` | `167 100% 48%` | **Accent chính** (xanh mint / teal), CTA, icon nhấn |
| `--primary-foreground` | `230 65% 7%` | Chữ trên nút primary (tối) |
| `--secondary` | `222 30% 12%` | Nền phụ |
| `--muted` | `228 25% 14%` | Vùng nền nhạt hơn card một chút |
| `--muted-foreground` | `214 15% 68%` | Phụ đề, mô tả |
| `--accent` | `223 36% 14%` | Hover surface (ghost button, outline hover) |
| `--destructive` | `0 84.2% 60.2%` | Lỗi / hủy |
| `--border` / `--input` | `220 28% 18%` | Viền, ô nhập |
| `--ring` | `167 100% 48%` | Focus ring đồng bộ primary |

### 3.3 Token “premium” tùy biến

| Token / class | Mục đích |
|---------------|----------|
| `--glow` | Tâm sáng hero, glow quanh UI |
| `--surface` / `--surface-soft` | (định nghĩa sẵn — có thể mở rộng layout) |
| `--hero-gradient`, `.hero-glow` | Gradient radial phía sau hero |
| `--hero-line`, `.hero-line` | Đường kẻ ngang gradient “spotlight” |
| `--shadow-premium` | Shadow + viền 1px cho **glass panel** |

### 3.4 Sidebar (shadcn sidebar)

- Biến `--sidebar-*` trong `:root` đang là **palette sáng** (gần `98%` background). Trong `.dark`, sidebar chuyển sang tông dầm. Component `sidebar` trong Tailwind map trực tiếp các biến này.

### 3.5 Màu ngữ nghĩa trading (ngoài token)

- **LONG / lãi:** `emerald-400`, nền `emerald-500/15`, viền `ring-emerald-500/25`.
- **SHORT / lỗ:** `red-400`, nền `red-500/15`, viền `ring-red-500/25`.
- Một số SVG / stroke cố định: `hsl(167,100%,48%)` trùng `--primary`.

---

## 4. Hình học, đổ bóng, hiệu ứng nền

### 4.1 Bo góc

- `--radius: 0.85rem` (~13.6px).
- Tailwind: `rounded-lg` = `var(--radius)`, `md` = `calc(var(--radius) - 2px)`, `sm` = `-4px`.
- Pattern marketing: nút **CTA `rounded-full`**, ảnh dashboard **`rounded-3xl`**, logo box **`rounded-lg` / `rounded-xl`**.

### 4.2 Glass morphism

Class **`.glass-panel`**:

- `border border-border/80`
- `bg-card/70 backdrop-blur-md`
- `box-shadow: var(--shadow-premium)`

Dùng cho: thẻ benefit, pricing, FAQ wrapper, ảnh hero, CTA cuối trang, card đăng nhập (kết hợp `.auth-card`).

### 4.3 Nền toàn cục

- `body`: `bg-background text-foreground` + radial gradient `hsl(var(--primary) / 0.13)` từ trên xuống.
- **Auth (`auth-page-bg`):** hai radial (primary + violet `260 80% 60%`), lớp phủ `.auth-glow-1/2`.
- **Trading (`.trading-root`):** radial góc + `zoom: 1.35` để phóng to toàn bộ subtree (ghi chú trong CSS: không đổi `rem` trên `<html>`).

### 4.4 Thanh cuộn trading

- `.trading-scroll`: thanh mỏng 3px, thumb `hsl(var(--border))`, bo tròn `9999px`.

---

## 5. Thành phần UI (shadcn) — hành vi UX

### 5.1 Button (`button.tsx`)

- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
- Focus: `ring-2 ring-ring ring-offset-2 ring-offset-background`.
- Size: `default` (h-10), `sm`, `lg`, `icon`.
- Marketing hay “đè” thêm `rounded-full`, padding lớn cho CTA.

### 5.2 Card / Input / Form

- **Card:** `rounded-lg border bg-card shadow-sm`; nội dung thường kèm `glass-panel`.
- **Auth input:** class `.auth-input` — nền bán trong suốt, blur, focus ring primary.
- **Auth button:** `.auth-btn` — gradient primary, shadow glow, hover nâng nhẹ `translateY`.

### 5.3 Navigation Menu (FinMom header)

- Mega menu 3 cột (`grid-cols-3`), max width `min(72rem, calc(100vw - 1.25rem))`.
- **Trigger:** `triggerCls` — không nền, `text-muted-foreground`, hover / open → `text-foreground`.
- **Item:** icon Lucide `text-primary`, title `font-medium`, mô tả `text-muted-foreground`, hover row `bg-muted/50`.
- Badge “Coming soon”: `bg-primary/15 text-primary text-[10px] rounded-full`.

### 5.4 Accordion (FAQ)

- Trong card glass; một cột câu hỏi; nội dung trả lời placeholder ngắn lặp lại.

### 5.5 Toast

- **Radix** `Toaster` + hook `use-toast` (trang login/register, rule engine).
- **Sonner:** style theo `background` / `foreground` / `border` / `primary` (cần theme — xem phần 8).

### 5.6 Chart

- Container chuẩn hóa màu lưới, tick, tooltip theo design tokens (`muted-foreground`, `border`).
- Chart có thể khai báo `theme: { light: "...", dark: "..." }` per-series.

---

## 6. Pattern theo loại trang

### 6.1 Marketing / Landing (`FinMomPage`)

- **Header:** `sticky top-0 z-50`, `border-b border-border/60`, `bg-background/80 backdrop-blur-xl`.
- **Grid header:** `grid-cols-[1fr_auto_1fr]`, `max-w-6xl`, padding `px-5 sm:px-8`.
- **Sections:** `max-w-6xl`, vùng đệm dọc lớn `py-20`, typography nhất quán H2 + lead paragraph.
- **Social proof:** sao + số; divider line `.hero-line`.
- **Pricing:** 3 cột; plan featured `border-primary`; checklist với icon `Check` màu primary.
- **Testimonial:** một card lớn, avatar tròn.
- **CTA footer:** card full-width trong container, nút + `ChevronRight`.
- **Prop `focus`:** khi không phải `hero`, chỉ hiển thị một section + block “Why Choose FinMom?” — pattern tái sử dụng nội dung benefits.

### 6.2 Auth (`Login`, `Register`)

- Full viewport center, `auth-page-bg` + glow layers.
- Một card `max-w-md`, animation vào `.auth-card` (`auth-card-in`).
- Form spacing `space-y-5`, link phụ `text-primary hover:underline`.
- Spinner `.auth-spinner` trên nút submit khi loading.

### 6.3 Trading (`TradingPage` + `TradingMainContainer`)

- Root `.trading-root`: zoom 1.35, nền riêng, tabular nums.
- Header giống kiểu landing nhưng compact hơn (`py-2.5`), logo **FinMom** + class `.finmom-logo-text` (gradient text) nếu dùng; thường gọi `BrandLogoLink` / `FinMomWordmark`.
- Nav: `NavLink` với trạng thái active (border/primary).
- Layout dày: card nhiều tầng, bảng, donut chart PnL, màu emerald/red cho PnL và side badge.
- **Scrollbar** tùy chỉnh qua `.trading-scroll` nơi cần.

### 6.4 Rule Engine & Analysis

- Wizard nhiều bước với animation class `.rule-engine-step-tick-pop`, `.rule-engine-step-enter`.
- Pill hành động: `stepActionPill` — viền, nền bán trong suốt, hover nhấn primary nhẹ.
- Kết hợp upload PDF, phân tích streaming, session persistence (`ruleEngineUiSession`).

### 6.5 Các trang con khác (`HowItWorks`, `Pricing`, `Faq`, `Profile`, `NotFound`)

- Thường Compose lại `FinMomPage` với `focus` tương ứng hoặc shell riêng; cùng họ màu và glass.

---

## 7. Chuyển động & micro-interaction

| Hiệu ứng | Vị trí |
|-----------|--------|
| `auth-card-in` | Card đăng nhập — fade + translateY + scale |
| `dash-progress` | (định nghĩa sẵn — có thể dùng progress UI) |
| `rule-engine-step-tick-pop` / `enter` | Bước rule engine |
| `accordion-down` / `up` | Accordion shadcn |
| Hover card pricing / trading | `hover:-translate-y-1`, `transition-transform duration-300` |
| Button auth / default | `transition-colors`, shadow/translate trên auth |

---

## 8. Theme switching & điểm cần lưu ý (UX kỹ thuật)

- **`tailwind.config.ts`:** `darkMode: ["class"]` — chuẩn bị cho `.dark` trên ancestor.
- **`sonner.tsx`** gọi `useTheme()` từ `next-themes` nhưng **không có `ThemeProvider` trong `main.tsx` / `App.tsx`**. Kết quả: theme Sonner fallback **`"system"`**; nên bổ sung provider hoặc bỏ phụ thuộc nếu không dùng đổi theme.
- **`App.css`:** vẫn chứa style mặc định Vite (#root max-width 1280px, .logo spin). **`main.tsx` chỉ import `index.css`** — file này có thể là di sản, nhưng nếu import nhầm có thể xung đột layout marketing full-width.

---

## 9. Accessibility & i18n

- Radix cung cấp focus scope, escape đóng menu/dialog; vẫn nên kiểm tra thứ tự tab trên mega menu.
- Một số `aria-hidden` trên lớp trang trí (hero glow).
- **Đa ngôn ngữ:** FinMom marketing **tiếng Anh**; Login/Register và một số toast **tiếng Việt** — cần thống nhất nếu sản phẩm đơn ngữ.

---

## 10. Brand & naming

- **FinMom** là tên sản phẩm trong toàn bộ UI (landing, marketplace, trading shell, footer marketing, FAQ/pricing, auth toast).

---

## 11. Tài nguyên & file tham chiếu

| Chủ đề | File |
|--------|------|
| Tokens, utility, animation | `src/index.css` |
| Tailwind theme | `tailwind.config.ts` |
| shadcn config | `components.json` |
| Landing | `src/components/cryptix/FinMomPage.tsx` |
| Trading shell | `src/pages/Trading.tsx`, `src/components/trading/TradingMainContainer.tsx` |
| Rule engine UI | `src/pages/RuleEngineAndAnalysisPage.tsx` |
| Auth | `src/pages/Login.tsx`, `src/pages/Register.tsx` |
| Merge class | `src/lib/utils.ts` (`cn`) |

---

*Tài liệu phản ánh trạng thái codebase tại thời điểm tổng hợp; khi chỉnh token hoặc thêm theme provider, cập nhật mục 3 và 8 cho khớp hành vi thực tế.*
