package hotelmanagement.backend.service;

import hotelmanagement.backend.entity.Phong;
import hotelmanagement.backend.repository.DatphongRepository;
import hotelmanagement.backend.repository.PhongRepository;
import org.apache.catalina.LifecycleState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    private DatphongRepository datphongRepository;
    @Autowired
    private PhongRepository phongRepository;
    public List<Phong> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        List<Integer> bookedRoomIds = datphongRepository.findBookedRoomIds(checkIn, checkOut);
        List<Phong> allRooms = phongRepository.findAll();
        if(bookedRoomIds.isEmpty())
            return allRooms;
        return allRooms.stream()
                .filter(phong -> !bookedRoomIds.contains(phong.getId()))
                .collect(Collectors.toList());
    }


}
