export const mockMesses = [
  {
    id: 1,
    name: "Green Valley Mess",
    rating: 4.5,
    location: "Sector 17, Chandigarh",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    monthlyPrice: 3500,
    isSubscribed: true,
    menu: [
      { dish: "Dal Rice", price: 80, image: "https://images.pexels.com/photos/5864264/pexels-photo-5864264.jpeg" },
      { dish: "Paneer Curry", price: 120, image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg" },
      { dish: "Roti", price: 15, image: "https://images.pexels.com/photos/5419336/pexels-photo-5419336.jpeg" },
    ]
  },
  {
    id: 2,
    name: "Maharaja Mess",
    rating: 4.2,
    location: "Model Town, Delhi",
    image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
    monthlyPrice: 4200,
    isSubscribed: false,
    menu: [
      { dish: "Biryani", price: 150, image: "https://images.pexels.com/photos/4056497/pexels-photo-4056497.jpeg" },
      { dish: "Chicken Curry", price: 180, image: "https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg" },
      { dish: "Naan", price: 25, image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg" },
    ]
  },
  {
    id: 3,
    name: "Student's Choice Mess",
    rating: 4.0,
    location: "Rajouri Garden, Delhi",
    image: "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
    monthlyPrice: 2800,
    isSubscribed: true,
    menu: [
      { dish: "Chole Bhature", price: 90, image: "https://images.pexels.com/photos/5560661/pexels-photo-5560661.jpeg" },
      { dish: "Rajma Rice", price: 100, image: "https://images.pexels.com/photos/5560758/pexels-photo-5560758.jpeg" },
      { dish: "Papad", price: 10, image: "https://images.pexels.com/photos/5560657/pexels-photo-5560657.jpeg" },
    ]
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Computer Science Student",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    content: "MessMate has made my college life so much easier! I can track my meals and never miss a good menu anymore.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "MBA Student",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    content: "The attendance tracking feature is amazing. I can plan my meals in advance and save money too!",
    rating: 5
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Mess Owner",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    content: "Managing my mess customers has become so simple. The payment tracking and menu management features are excellent.",
    rating: 4
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: "Today's Special Menu",
    message: "Green Valley Mess has added Butter Chicken to today's menu",
    time: "2 hours ago",
    type: "menu",
    isRead: false
  },
  {
    id: 2,
    title: "Payment Reminder",
    message: "Your subscription for Maharaja Mess expires in 3 days",
    time: "1 day ago",
    type: "payment",
    isRead: true
  },
  {
    id: 3,
    title: "New Mess Available",
    message: "Student's Paradise Mess is now available in your area",
    time: "3 days ago",
    type: "info",
    isRead: true
  }
];

export const mockCustomers = [
  {
    id: 1,
    name: "Rohan Kumar",
    email: "rohan@email.com",
    phone: "+91 9876543210",
    plan: "Monthly",
    joinDate: "2024-01-15",
    status: "Active",
    attendance: 85,
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
  },
  {
    id: 2,
    name: "Sneha Reddy",
    email: "sneha@email.com",
    phone: "+91 9876543211",
    plan: "Quarterly",
    joinDate: "2024-02-01",
    status: "Active",
    attendance: 92,
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
  },
  {
    id: 3,
    name: "Vikash Singh",
    email: "vikash@email.com",
    phone: "+91 9876543212",
    plan: "Monthly",
    joinDate: "2024-01-20",
    status: "Expired",
    attendance: 78,
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
  }
];