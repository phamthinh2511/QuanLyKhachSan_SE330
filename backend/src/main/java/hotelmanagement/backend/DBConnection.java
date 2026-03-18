package hotelmanagement.backend;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

    
    private static final String URL =
        "jdbc:mysql://gondola.proxy.rlwy.net:54684/railway?useSSL=false&allowPublicKeyRetrieval=true";

    private static final String USER = "root";
    private static final String PASSWORD = "rQASJZzfcplwQnDUiDRlkoPbfxeNyGdu";

    public static Connection getConnection() {
    try {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    } catch (java.sql.SQLException e) {
        // Thay Exception bằng SQLException cụ thể
        System.err.println("Lỗi kết nối: " + e.getMessage());
        return null;
    }
}
}