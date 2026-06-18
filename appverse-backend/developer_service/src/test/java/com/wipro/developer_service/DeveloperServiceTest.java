package com.wipro.developer_service;



import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import com.wipro.developer_service.dto.DeveloperAppRequest;
import com.wipro.developer_service.dto.DeveloperAppResponse;
import com.wipro.developer_service.entity.AppVersion;
import com.wipro.developer_service.entity.DeveloperApp;
import com.wipro.developer_service.repository.AppVersionRepository;
import com.wipro.developer_service.repository.DeveloperAppRepository;
import com.wipro.developer_service.service.DeveloperService;

@ExtendWith(MockitoExtension.class)
class DeveloperServiceTest {

    @Mock
    private DeveloperAppRepository developerAppRepository;

    @Mock
    private AppVersionRepository appVersionRepository;

    @Mock
    private RestTemplate restTemplate;

    @Spy
    @InjectMocks
    private DeveloperService developerService;

    private DeveloperApp app;
    private DeveloperAppRequest request;

    @BeforeEach
    void setUp() {

        ReflectionTestUtils.setField(
                developerService,
                "appServiceUrl",
                "http://localhost:8082"
        );

        app = new DeveloperApp();
        app.setId(1L);
        app.setName("Test App");
        app.setDescription("Description");
        app.setCategory("Games");
        app.setDeveloperId(100L);
        app.setDeveloperName("Ajith");
        app.setCurrentVersion("1.0");
        app.setReleaseNotes("Initial Release");
        app.setStatus("PENDING");

        request = new DeveloperAppRequest();
        request.setName("Test App");
        request.setDescription("Description");
        request.setCategory("Games");
        request.setDeveloperName("Ajith");
        request.setCurrentVersion("1.0");
        request.setReleaseNotes("Initial Release");
        request.setImageUrl("image.png");
    }

    @Test
    void testCreateApp() {

        when(developerAppRepository.save(any(DeveloperApp.class)))
                .thenReturn(app);

        DeveloperAppResponse response =
                developerService.createApp(request, 100L);

        assertNotNull(response);
        assertEquals("Test App", response.getName());

        verify(developerAppRepository).save(any());
        verify(appVersionRepository).save(any(AppVersion.class));
    }

    @Test
    void testGetAppById() {

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.of(app));

        DeveloperAppResponse response =
                developerService.getAppById(1L);

        assertEquals("Test App", response.getName());
    }

    @Test
    void testSubmitForReview() {

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(developerAppRepository.save(any()))
                .thenReturn(app);

        DeveloperAppResponse response =
                developerService.submitForReview(1L,100L);

        assertNotNull(response);
        verify(developerAppRepository).save(any());
    }

    @Test
    void testApproveApp() {

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(developerAppRepository.save(any()))
                .thenReturn(app);

        doNothing().when(developerService)
                .syncToMarketplace(any());

        DeveloperAppResponse response =
                developerService.approveApp(1L);

        assertNotNull(response);
        verify(developerService).syncToMarketplace(any());
    }

    @Test
    void testBlockApp() {

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(developerAppRepository.save(any()))
                .thenReturn(app);

        doNothing().when(developerService)
                .removeFromMarketplace(anyString());

        DeveloperAppResponse response =
                developerService.blockApp(1L);

        assertEquals("BLOCKED", app.getStatus());
        verify(developerService).removeFromMarketplace(anyString());
    }

    @Test
    void testUpdateApp() {

        app.setStatus("PUBLISHED");

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(developerAppRepository.save(any()))
                .thenReturn(app);

        doNothing().when(developerService)
                .syncUpdateToMarketplace(any());

        DeveloperAppResponse response =
                developerService.updateApp(1L, request,100L);

        assertNotNull(response);
        verify(developerService).syncUpdateToMarketplace(any());
    }

    @Test
    void testReleaseNewVersion() {

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(developerAppRepository.save(any()))
                .thenReturn(app);

        DeveloperAppResponse response =
                developerService.releaseNewVersion(
                        1L,
                        "2.0",
                        "Bug Fixes",
                        100L);

        assertEquals("2.0", app.getCurrentVersion());

        verify(appVersionRepository)
                .save(any(AppVersion.class));
    }

    @Test
    void testDeleteApp() {

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(appVersionRepository.findByAppId(1L))
                .thenReturn(Collections.singletonList(new AppVersion()));

        doNothing().when(developerService)
                .removeFromMarketplace(anyString());

        developerService.deleteApp(1L,100L);

        verify(appVersionRepository).deleteAll(anyList());
        verify(developerAppRepository).delete(app);
    }

    @Test
    void testGetMyApps() {

        when(developerAppRepository.findByDeveloperId(100L))
                .thenReturn(Arrays.asList(app));

        assertEquals(
                1,
                developerService.getMyApps(100L).size()
        );
    }

    @Test
    void testUnauthorizedUpdate() {

        app.setDeveloperId(999L);

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.of(app));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> developerService.updateApp(
                        1L,
                        request,
                        100L
                )
        );

        assertEquals(
                "Unauthorized to update this app",
                ex.getMessage()
        );
    }

    @Test
    void testAppNotFound() {

        when(developerAppRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> developerService.getAppById(1L)
        );
    }
}
