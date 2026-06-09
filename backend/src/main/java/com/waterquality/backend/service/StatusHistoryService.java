package com.waterquality.backend.service;

import com.waterquality.backend.entity.StatusHistory;
import com.waterquality.backend.repository.StatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatusHistoryService {

    private final StatusHistoryRepository statusHistoryRepository;

    public void logStatusChange(Long reportId, Long changedBy,
                                String oldStatus, String newStatus, String note) {
        StatusHistory history = new StatusHistory();
        history.setReportId(reportId);
        history.setChangedBy(changedBy);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setNote(note);
        statusHistoryRepository.save(history);
    }

    public List<StatusHistory> getHistoryForReport(Long reportId) {
        return statusHistoryRepository.findByReportIdOrderByChangedAtAsc(reportId);
    }
}