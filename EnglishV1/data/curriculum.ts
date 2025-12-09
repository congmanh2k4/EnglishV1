import { Category } from "../types";

export const CURRICULUM: Category[] = [
  {
    id: "daily_life",
    title: "Giao tiếp Hàng ngày",
    description: "Các tình huống thông dụng trong cuộc sống.",
    icon: "☕",
    lessons: [
      { id: "dl_1", title: "Giới thiệu bản thân", description: "Cách chào hỏi và giới thiệu cơ bản.", queryTopic: "Self-introduction and greeting a new friend" },
      { id: "dl_2", title: "Đặt món tại quán cafe", description: "Gọi đồ uống và thanh toán.", queryTopic: "Ordering coffee and paying at a cafe" },
      { id: "dl_3", title: "Nói về sở thích", description: "Chia sẻ về những gì bạn thích làm.", queryTopic: "Talking about hobbies and free time activities" },
      { id: "dl_4", title: "Mời bạn đi chơi", description: "Rủ rê và sắp xếp cuộc hẹn.", queryTopic: "Inviting a friend to hang out and making plans" }
    ]
  },
  {
    id: "travel",
    title: "Du lịch & Khám phá",
    description: "Hành trang ngôn ngữ cho các chuyến đi.",
    icon: "✈️",
    lessons: [
      { id: "tr_1", title: "Tại sân bay", description: "Check-in và tìm cửa ra máy bay.", queryTopic: "Checking in at the airport and security check" },
      { id: "tr_2", title: "Nhận phòng khách sạn", description: "Check-in và hỏi về tiện nghi.", queryTopic: "Checking into a hotel and asking about amenities" },
      { id: "tr_3", title: "Hỏi đường", description: "Hỏi đường đi đến địa điểm nổi tiếng.", queryTopic: "Asking for directions to a tourist attraction" },
      { id: "tr_4", title: "Giải quyết sự cố", description: "Báo mất đồ hoặc phàn nàn dịch vụ.", queryTopic: "Reporting a lost item or complaining about service" }
    ]
  },
  {
    id: "business",
    title: "Tiếng Anh Công sở",
    description: "Chuyên nghiệp hóa phong cách làm việc.",
    icon: "💼",
    lessons: [
      { id: "bz_1", title: "Phỏng vấn xin việc", description: "Trả lời các câu hỏi phỏng vấn phổ biến.", queryTopic: "Answering common job interview questions" },
      { id: "bz_2", title: "Tham gia cuộc họp", description: "Đưa ra ý kiến và tranh luận lịch sự.", queryTopic: "Expressing opinions and agreeing/disagreeing in a meeting" },
      { id: "bz_3", title: "Thuyết trình", description: "Mở đầu và dẫn dắt bài thuyết trình.", queryTopic: "Opening a presentation and outlining the agenda" },
      { id: "bz_4", title: "Đàm phán lương", description: "Thương lượng mức lương và đãi ngộ.", queryTopic: "Negotiating salary and benefits" }
    ]
  },
  {
    id: "ielts_speaking",
    title: "Luyện thi IELTS",
    description: "Các chủ đề thường gặp trong IELTS Speaking.",
    icon: "🎓",
    lessons: [
      { id: "ie_1", title: "Part 1: Hometown", description: "Nói về quê hương nơi bạn sinh sống.", queryTopic: "IELTS Speaking Part 1 topic: Hometown" },
      { id: "ie_2", title: "Part 2: Describe a person", description: "Mô tả một người mà bạn ngưỡng mộ.", queryTopic: "IELTS Speaking Part 2: Describe a person you admire" },
      { id: "ie_3", title: "Part 3: Technology", description: "Thảo luận sâu về công nghệ.", queryTopic: "IELTS Speaking Part 3: Impact of technology on society" }
    ]
  }
];