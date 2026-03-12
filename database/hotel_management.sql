-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 12, 2026 lúc 03:03 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hotel_management`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ct_datphong`
--

CREATE TABLE `ct_datphong` (
  `MaCTDatPhong` int(11) NOT NULL,
  `MaDatPhong` int(11) NOT NULL,
  `MaPhong` int(11) NOT NULL,
  `DonGia` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ct_hoadon`
--

CREATE TABLE `ct_hoadon` (
  `MaCTHoaDon` int(11) NOT NULL,
  `MaHoaDon` int(11) NOT NULL,
  `MaPhong` int(11) NOT NULL,
  `MaDichVu` int(11) NOT NULL,
  `LoaiChiPhi` varchar(50) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `DonGia` double NOT NULL,
  `ThanhTien` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ct_phieuthuephong`
--

CREATE TABLE `ct_phieuthuephong` (
  `MaCTPhieuThue` int(11) NOT NULL,
  `MaPhieuThue` int(11) NOT NULL,
  `MaPhong` int(11) NOT NULL,
  `DonGia` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `datphong`
--

CREATE TABLE `datphong` (
  `MaDatPhong` int(11) NOT NULL,
  `MaKhachHang` int(11) NOT NULL,
  `NgayDat` date NOT NULL,
  `NgayNhan` date NOT NULL,
  `NgayTra` date NOT NULL,
  `TrangThai` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dichvu`
--

CREATE TABLE `dichvu` (
  `MaDichVu` int(11) NOT NULL,
  `TenDichVu` varchar(100) NOT NULL,
  `GiaDichVu` double NOT NULL,
  `MoTa` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

CREATE TABLE `hoadon` (
  `MaHoaDon` int(11) NOT NULL,
  `MaPhieuThue` int(11) NOT NULL,
  `MaNhanVien` int(11) NOT NULL,
  `NgayThanhToan` date NOT NULL,
  `TongTien` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

CREATE TABLE `khachhang` (
  `MaKhachHang` int(11) NOT NULL,
  `TenKhachHang` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) NOT NULL,
  `GioiTinh` varchar(10) NOT NULL,
  `NgaySinh` date NOT NULL,
  `DiaChi` varchar(200) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `CCCD` varchar(12) NOT NULL,
  `LoaiKhachHang` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kiemkephong`
--

CREATE TABLE `kiemkephong` (
  `MaKiemKe` int(11) NOT NULL,
  `MaPhieuThue` int(11) NOT NULL,
  `MaPhong` int(11) NOT NULL,
  `MaNhanVien` int(11) NOT NULL,
  `NgayKiemKe` date NOT NULL,
  `TinhTrang` varchar(100) NOT NULL,
  `TienBoiThuong` double NOT NULL,
  `GhiChu` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loaiphong`
--

CREATE TABLE `loaiphong` (
  `MaLoaiPhong` int(11) NOT NULL,
  `TenLoaiPhong` varchar(100) NOT NULL,
  `DonGia` double NOT NULL,
  `MoTa` varchar(200) NOT NULL,
  `SucChuaToiDa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `loaiphong`
--

INSERT INTO `loaiphong` (`MaLoaiPhong`, `TenLoaiPhong`, `DonGia`, `MoTa`, `SucChuaToiDa`) VALUES
(1, 'Phòng đơn', 300000, 'Phòng dành cho 1 người', 1),
(2, 'Phòng đôi', 500000, 'Phòng dành cho 2 người', 2),
(3, 'Phòng gia đình', 700000, 'Phòng cho gia đình nhỏ', 4),
(4, 'Phòng VIP', 1200000, 'Phòng cao cấp đầy đủ tiện nghi', 2),
(5, 'Phòng Tổng Thống', 3000000, 'Phòng cao cấp nhất khách sạn', 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhanvien`
--

CREATE TABLE `nhanvien` (
  `MaNhanVien` int(11) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `NgaySinh` date NOT NULL,
  `SoDienThoai` varchar(15) NOT NULL,
  `ChucVu` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieuthuephong`
--

CREATE TABLE `phieuthuephong` (
  `MaPhieuThue` int(11) NOT NULL,
  `MaDatPhong` int(11) NOT NULL,
  `MaKhachHang` int(11) NOT NULL,
  `MaNhanVien` int(11) NOT NULL,
  `NgayNhanPhong` date NOT NULL,
  `NgayTraPhong` date NOT NULL,
  `TrangThai` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong`
--

CREATE TABLE `phong` (
  `MaPhong` int(11) NOT NULL,
  `MaLoaiPhong` int(11) NOT NULL,
  `TrangThai` varchar(50) NOT NULL,
  `SoTang` int(11) NOT NULL,
  `SucChua` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sudungdichvu`
--

CREATE TABLE `sudungdichvu` (
  `MaSuDungDichVu` int(11) NOT NULL,
  `MaPhieuThue` int(11) NOT NULL,
  `MaDichVu` int(11) NOT NULL,
  `MaPhong` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `DonGia` double NOT NULL,
  `ThanhTien` double NOT NULL,
  `NgaySuDung` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `MaTaiKhoan` int(11) NOT NULL,
  `TenDangNhap` varchar(50) NOT NULL,
  `MatKhau` varchar(100) NOT NULL,
  `LoaiTaiKhoan` varchar(50) NOT NULL,
  `MaNhanVien` int(11) NOT NULL,
  `MaKhachHang` int(11) NOT NULL,
  `NgayTao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ct_datphong`
--
ALTER TABLE `ct_datphong`
  ADD PRIMARY KEY (`MaCTDatPhong`),
  ADD KEY `fk_ctdatphong_datphong` (`MaDatPhong`),
  ADD KEY `fk_ctdatphong_phong` (`MaPhong`);

--
-- Chỉ mục cho bảng `ct_hoadon`
--
ALTER TABLE `ct_hoadon`
  ADD PRIMARY KEY (`MaCTHoaDon`),
  ADD KEY `fk_cthoadon_hoadon` (`MaHoaDon`),
  ADD KEY `fk_cthoadon_dichvu` (`MaDichVu`),
  ADD KEY `fk_cthoadon_phong` (`MaPhong`);

--
-- Chỉ mục cho bảng `ct_phieuthuephong`
--
ALTER TABLE `ct_phieuthuephong`
  ADD PRIMARY KEY (`MaCTPhieuThue`),
  ADD KEY `fk_ctphieuthuephong_phieuthue` (`MaPhieuThue`),
  ADD KEY `fk_ctphieuthuephong_phong` (`MaPhong`);

--
-- Chỉ mục cho bảng `datphong`
--
ALTER TABLE `datphong`
  ADD PRIMARY KEY (`MaDatPhong`),
  ADD KEY `fk_datphong_khachhang` (`MaKhachHang`);

--
-- Chỉ mục cho bảng `dichvu`
--
ALTER TABLE `dichvu`
  ADD PRIMARY KEY (`MaDichVu`);

--
-- Chỉ mục cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`MaHoaDon`),
  ADD KEY `fk_hoadon_phieuthue` (`MaPhieuThue`),
  ADD KEY `fk_hoadon_nhanvien` (`MaNhanVien`);

--
-- Chỉ mục cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`MaKhachHang`) USING BTREE;

--
-- Chỉ mục cho bảng `kiemkephong`
--
ALTER TABLE `kiemkephong`
  ADD PRIMARY KEY (`MaKiemKe`),
  ADD KEY `fk_kiemkephong_phong` (`MaPhong`),
  ADD KEY `fk_kiemkephong_nhanvien` (`MaNhanVien`),
  ADD KEY `fk_kiemkephong_phieuthue` (`MaPhieuThue`);

--
-- Chỉ mục cho bảng `loaiphong`
--
ALTER TABLE `loaiphong`
  ADD PRIMARY KEY (`MaLoaiPhong`);

--
-- Chỉ mục cho bảng `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD PRIMARY KEY (`MaNhanVien`);

--
-- Chỉ mục cho bảng `phieuthuephong`
--
ALTER TABLE `phieuthuephong`
  ADD PRIMARY KEY (`MaPhieuThue`),
  ADD KEY `fk_phieuthuephong_datphong` (`MaDatPhong`),
  ADD KEY `fk_phieuthuephong_khachhang` (`MaKhachHang`),
  ADD KEY `fk_phieuthuephong_nhanvien` (`MaNhanVien`);

--
-- Chỉ mục cho bảng `phong`
--
ALTER TABLE `phong`
  ADD PRIMARY KEY (`MaPhong`),
  ADD KEY `fk_phong_loaiphong` (`MaLoaiPhong`);

--
-- Chỉ mục cho bảng `sudungdichvu`
--
ALTER TABLE `sudungdichvu`
  ADD PRIMARY KEY (`MaSuDungDichVu`),
  ADD KEY `fk_sudungdichvu_phieuthuephong` (`MaPhieuThue`),
  ADD KEY `fk_sudungdichvu_dichvu` (`MaDichVu`),
  ADD KEY `fk_sudungdichvu_phong` (`MaPhong`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`MaTaiKhoan`),
  ADD KEY `fk_taikhoan_nhanvien` (`MaNhanVien`),
  ADD KEY `fk_taikhoan_khachhang` (`MaKhachHang`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `ct_datphong`
--
ALTER TABLE `ct_datphong`
  MODIFY `MaCTDatPhong` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `ct_phieuthuephong`
--
ALTER TABLE `ct_phieuthuephong`
  MODIFY `MaCTPhieuThue` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `MaKhachHang` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nhanvien`
--
ALTER TABLE `nhanvien`
  MODIFY `MaNhanVien` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `ct_datphong`
--
ALTER TABLE `ct_datphong`
  ADD CONSTRAINT `fk_ctdatphong_datphong` FOREIGN KEY (`MaDatPhong`) REFERENCES `datphong` (`MaDatPhong`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctdatphong_phong` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `ct_hoadon`
--
ALTER TABLE `ct_hoadon`
  ADD CONSTRAINT `fk_cthoadon_dichvu` FOREIGN KEY (`MaDichVu`) REFERENCES `dichvu` (`MaDichVu`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cthoadon_hoadon` FOREIGN KEY (`MaHoaDon`) REFERENCES `hoadon` (`MaHoaDon`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cthoadon_phong` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `ct_phieuthuephong`
--
ALTER TABLE `ct_phieuthuephong`
  ADD CONSTRAINT `fk_ctphieuthuephong_phieuthue` FOREIGN KEY (`MaPhieuThue`) REFERENCES `phieuthuephong` (`MaPhieuThue`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctphieuthuephong_phong` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `datphong`
--
ALTER TABLE `datphong`
  ADD CONSTRAINT `fk_datphong_khachhang` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `fk_hoadon_nhanvien` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hoadon_phieuthue` FOREIGN KEY (`MaPhieuThue`) REFERENCES `phieuthuephong` (`MaPhieuThue`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `kiemkephong`
--
ALTER TABLE `kiemkephong`
  ADD CONSTRAINT `fk_kiemkephong_nhanvien` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kiemkephong_phieuthue` FOREIGN KEY (`MaPhieuThue`) REFERENCES `phieuthuephong` (`MaPhieuThue`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kiemkephong_phong` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phieuthuephong`
--
ALTER TABLE `phieuthuephong`
  ADD CONSTRAINT `fk_phieuthuephong_datphong` FOREIGN KEY (`MaDatPhong`) REFERENCES `datphong` (`MaDatPhong`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phieuthuephong_khachhang` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phieuthuephong_nhanvien` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phong`
--
ALTER TABLE `phong`
  ADD CONSTRAINT `fk_phong_loaiphong` FOREIGN KEY (`MaLoaiPhong`) REFERENCES `loaiphong` (`MaLoaiPhong`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `sudungdichvu`
--
ALTER TABLE `sudungdichvu`
  ADD CONSTRAINT `fk_sudungdichvu_dichvu` FOREIGN KEY (`MaDichVu`) REFERENCES `dichvu` (`MaDichVu`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sudungdichvu_phieuthuephong` FOREIGN KEY (`MaPhieuThue`) REFERENCES `phieuthuephong` (`MaPhieuThue`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sudungdichvu_phong` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `fk_taikhoan_khachhang` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_taikhoan_nhanvien` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
