package com.wipro.app_service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
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
import org.mockito.junit.jupiter.MockitoExtension;

import com.wipro.app_service.dto.AppRequest;
import com.wipro.app_service.dto.AppResponse;
import com.wipro.app_service.entity.App;
import com.wipro.app_service.entity.Download;
import com.wipro.app_service.repository.AppRepository;
import com.wipro.app_service.repository.DownloadRepository;
import com.wipro.app_service.service.AppService;

@ExtendWith(MockitoExtension.class)
class AppServiceTest {

    @Mock
    private AppRepository appRepository;

    @Mock
    private DownloadRepository downloadRepository;

    @InjectMocks
    private AppService appService;

    private App app;
    private AppRequest request;

    @BeforeEach
    void setUp() {

        app = new App();
        app.setId(1L);
        app.setName("BattleZone");
        app.setDescription("Game");
        app.setCategory("Action");
        app.setDeveloperId(100L);
        app.setDeveloperName("Ajith");
        app.setAverageRating(4.5);
        app.setTotalDownloads(5);
        app.setStatus("ACTIVE");
        app.setImageUrl("image.png");

        request = new AppRequest();
        request.setName("BattleZone");
        request.setDescription("Game");
        request.setCategory("Action");
        request.setDeveloperId(100L);
        request.setDeveloperName("Ajith");
        request.setImageUrl("image.png");
    }

    @Test
    void testAddApp() {

        when(appRepository.save(any(App.class))).thenReturn(app);

        AppResponse response = appService.addApp(request);

        assertNotNull(response);
        assertEquals("BattleZone", response.getName());

        verify(appRepository).save(any(App.class));
    }

    @Test
    void testGetAllApps() {

        when(appRepository.findByStatus("ACTIVE"))
                .thenReturn(Arrays.asList(app));

        assertEquals(1, appService.getAllApps().size());

        verify(appRepository).findByStatus("ACTIVE");
    }

    @Test
    void testGetAppById() {

        when(appRepository.findById(1L))
                .thenReturn(Optional.of(app));

        AppResponse response = appService.getAppById(1L);

        assertEquals("BattleZone", response.getName());
    }

    @Test
    void testGetAppByIdNotFound() {

        when(appRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> appService.getAppById(1L));
    }

    @Test
    void testGetAppsByCategory() {

        when(appRepository.findByCategory("Action"))
                .thenReturn(Arrays.asList(app));

        assertEquals(1,
                appService.getAppsByCategory("Action").size());
    }

    @Test
    void testSearchApps() {

        when(appRepository.findByNameContainingIgnoreCase("Battle"))
                .thenReturn(Arrays.asList(app));

        assertEquals(1,
                appService.searchApps("Battle").size());
    }

    @Test
    void testGetAppsByDeveloper() {

        when(appRepository.findByDeveloperId(100L))
                .thenReturn(Arrays.asList(app));

        assertEquals(1,
                appService.getAppsByDeveloper(100L).size());
    }

    @Test
    void testIncrementDownload_FirstTime() {

        when(appRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(downloadRepository.existsByUserIdAndAppId(10L,1L))
                .thenReturn(false);

        appService.incrementDownload(1L,10L);

        verify(appRepository).save(any(App.class));
        verify(downloadRepository).save(any(Download.class));
    }

    @Test
    void testIncrementDownload_AlreadyDownloaded() {

        when(appRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(downloadRepository.existsByUserIdAndAppId(10L,1L))
                .thenReturn(true);

        appService.incrementDownload(1L,10L);

        verify(appRepository).save(any(App.class));
        verify(downloadRepository,never()).save(any());
    }

    @Test
    void testUpdateAverageRating() {

        when(appRepository.findById(1L))
                .thenReturn(Optional.of(app));

        when(appRepository.save(any(App.class)))
                .thenReturn(app);

        AppResponse response =
                appService.updateAverageRating(1L,4.9);

        assertNotNull(response);

        verify(appRepository).save(any(App.class));
    }

    @Test
    void testGetDownloadedIds() {

        Download download = new Download();
        download.setAppId(1L);

        when(downloadRepository.findByUserId(10L))
                .thenReturn(Collections.singletonList(download));

        assertEquals(1,
                appService.getUserDownloadedAppIds(10L).size());
    }

    @Test
    void testGetDownloadedNames() {

        Download download = new Download();
        download.setAppName("BattleZone");

        when(downloadRepository.findByUserId(10L))
                .thenReturn(Collections.singletonList(download));

        assertEquals(1,
                appService.getUserDownloadedAppNames(10L).size());
    }

    @Test
    void testRemoveByName() {

        when(appRepository.findByNameContainingIgnoreCase("Battle"))
                .thenReturn(Arrays.asList(app));

        appService.removeByName("Battle");

        verify(appRepository).save(any(App.class));
    }

    @Test
    void testUpdateByName() {

        when(appRepository.findByNameContainingIgnoreCase("Battle"))
                .thenReturn(Arrays.asList(app));

        appService.updateByName("Battle",request);

        verify(appRepository).save(any(App.class));
    }

}