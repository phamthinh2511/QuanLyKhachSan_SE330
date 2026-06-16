package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.PhongRequestDto;
import hotelmanagement.backend.dto.response.PhongResponseDto;
import hotelmanagement.backend.service.PhongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class PhongController {
    private final PhongService phongService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<List<PhongResponseDto>> getAll() { return ResponseEntity.ok(phongService.getAll()); }

    @GetMapping("/available")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<List<PhongResponseDto>> getAvailableRooms(
            @RequestParam("checkIn") String checkInStr,
            @RequestParam("checkOut") String checkOutStr) {
        java.time.LocalDate checkIn = java.time.LocalDate.parse(checkInStr);
        java.time.LocalDate checkOut = java.time.LocalDate.parse(checkOutStr);
        return ResponseEntity.ok(phongService.getAvailableRooms(checkIn, checkOut));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<PhongResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(phongService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PhongResponseDto> create(@RequestBody PhongRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phongService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PhongResponseDto> update(
            @PathVariable Integer id,
            @RequestBody PhongRequestDto dto){
        return ResponseEntity.ok(phongService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        phongService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trash")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PhongResponseDto>> getTrashBin() {
        return ResponseEntity.ok(phongService.getTrashBin());
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PhongResponseDto> restore(@PathVariable Integer id) {
        return ResponseEntity.ok(phongService.restore(id));
    }

    @DeleteMapping("/{id}/hard")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> hardDelete(@PathVariable Integer id) {
        phongService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }
}
