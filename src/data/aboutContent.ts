import portraitFounder1 from "@/assets/team-founder-1.png";
import portraitFounder2 from "@/assets/team-founder-2.png";

/** Chỉnh sửa tên, vai trò và bio trực tiếp trong file này. */
export type TeamMemberContent = {
  name: string;
  role: string;
  bio: string;
  portraitSrc: string;
};

export const aboutHero = {
  eyebrow: "Đội ngũ FinMom",
  title: "Chúng tôi xây dựng công cụ cho nhà đầu tư và người tạo nội dung chiến lược",
  subtitle:
    "FinMom kết nối marketplace, Rule Engine và tự động hóa — minh bạch, có kiểm soát rủi ro và tôn trọng thời gian của bạn.",
};

export const aboutMission = {
  headline: "Sứ mệnh",
  body:
    "Đưa các quy tắc giao dịch, mẫu và phân tích đến gần hơn với những ai muốn tự chủ quyết định — từ người mới đến người bán chiến lược trên marketplace. Chúng tôi không hứa lợi nhuận; chúng tôi cống hiến cho trải nghiệm an toàn, rõ ràng và có lộ trình học hỏi.",
};

export const aboutValues = [
  {
    title: "Giá trị & minh bạch",
    body: "Pricing, nhãn rủi ro và luồng Rule Engine được thiết kế để bạn hiểu mình đang dùng gì trước khi triển khai.",
  },
  {
    title: "Chú trọng sản phẩm",
    body: "Ưu tiên chất lượng luồng marketplace, cloning và sandbox thay vì hứa hẹn không thực tế về hiệu suất.",
  },
  {
    title: "Người tạo & cộng đồng",
    body: "Creators được công cụ niêm yết và phản hồi; người mua được lựa chọn có kiểm soát.",
  },
] as const;

export const teamMembers: TeamMemberContent[] = [
  {
    name: "Thành viên đồng sáng lập — 1",
    role: "Đồng sáng lập · Sản phẩm & vận hành",
    bio: "Đồng hành định hướng sản phẩm và trải nghiệm Rule Engine marketplace. Bạn có thể đổi tên và mô tả chính xác trong `aboutContent.ts`.",
    portraitSrc: portraitFounder1,
  },
  {
    name: "Thành viên đồng sáng lập — 2",
    role: "Đồng sáng lập · Kỹ thuật & nền tảng",
    bio: "Tập trung kiến trúc và độ tin cậy của nền tảng. Cập nhật bio và ảnh trong `team-founder-2.png` nếu cần phiên bản mới nhất.",
    portraitSrc: portraitFounder2,
  },
];

export const aboutCta = {
  title: "Bắt đầu với marketplace hoặc Rule Engine.",
  subtitle: "Tạo tài khoản miễn phí và khám phá template; nâng cấp khi bạn sẵn sàng đi sâu.",
};
