package com.waterquality.backend.controller;

import com.waterquality.backend.service.UpvoteService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class UpvoteController {

    private final UpvoteService upvoteService;

    // POST /api/reports/{id}/upvote
    @PostMapping("/{id}/upvote")
    public String upvote(@PathVariable Long id, HttpServletRequest request) {
        String ip = request.getRemoteAddr();  // get voter's IP automatically
        return upvoteService.upvoteReport(id, ip);
    }
}