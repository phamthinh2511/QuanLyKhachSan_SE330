export const monthlyData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  revenue: [45000, 52000, 47000, 61000, 58000, 67000, 85000, 83000, 73000, 65000, 57000, 76000],
  profit:  [22000, 26000, 23000, 31000, 29000, 34000, 44000, 43000, 38000, 33000, 28000, 40000],
  occupancy: [65, 72, 68, 80, 76, 84, 92, 90, 85, 78, 70, 82],
  guests:  [210, 245, 228, 290, 275, 310, 385, 378, 340, 305, 268, 348],
};

export const quarterlyData = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  revenue: [144000, 186000, 241000, 198000],
  profit:  [71000,  94000,  125000, 101000],
  occupancy: [68, 80, 89, 77],
  guests:  [683, 875, 1103, 921],
};

export const thisMonthData = {
  labels: Array.from({ length: 30 }, (_, i) => String(i + 1)),
  revenue: Array.from({ length: 30 }, () => Math.floor(Math.random() * 3000 + 1500)),
  profit:  Array.from({ length: 30 }, () => Math.floor(Math.random() * 1500 + 800)),
  occupancy: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30 + 60)),
  guests:  Array.from({ length: 30 }, () => Math.floor(Math.random() * 15 + 5)),
};