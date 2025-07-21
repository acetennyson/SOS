package com.iamsupreme.xox;

import android.util.Log;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;

import androidx.media.VolumeProviderCompat;
//import androidx.media.session.MediaSessionCompat;
//import androidx.media.session.PlaybackStateCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileReader;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

import com.google.gson.Gson;
import com.iamsupreme.xox.GestureTypes.ButtonRecord;
import com.iamsupreme.xox.GestureTypes.ButtonGesture;
import com.iamsupreme.xox.GestureTypes.GestureFile;
public class MyForegroundService extends Service {
  private MediaSessionCompat mediaSession;
  private List<ButtonRecord> buttonBuffer = new ArrayList<>();
  private long lastInputTime = 0;
  private int recordTimeout = 2500; // ms
  private List<GestureTypes.CustomG> allGestures = new ArrayList<>();
  private List<GestureTypes.ButtonGesture> buttonGestures = new ArrayList<>();


  @Override
  public void onCreate() {
    super.onCreate();
    this.fetchAndParseFile();
    turnOnVolumeListeners();
  }

  private List<GestureTypes.CustomG> fetchAndParseFile() {
    File file = new File(getFilesDir(), "gestures.json");
    StringBuilder text = new StringBuilder();
    try (BufferedReader br = new BufferedReader(new FileReader(file))) {
      String line;
      while ((line = br.readLine()) != null) {
        text.append(line);
      }
      Gson gson = new Gson();
      Log.d("text", text.toString());
      GestureFile recovered = gson.fromJson(text.toString(), GestureFile.class);
      this.allGestures = recovered.gestures;
      this.buttonGestures = allGestures.stream()
        .filter(g -> g.gType == 2)
        .collect(Collectors.toList());
    } catch (Exception e) {
      e.printStackTrace();
      return new ArrayList<>();
    }
  }

  private void turnOnVolumeListeners() {
    mediaSession = new MediaSessionCompat(this, "VolumeService");
    mediaSession.setFlags(MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS |
      MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS);
    mediaSession.setPlaybackState(new PlaybackStateCompat.Builder()
      .setState(PlaybackStateCompat.STATE_PLAYING, 0, 0)
      .build());

    VolumeProviderCompat myVolumeProvider =
      new VolumeProviderCompat(VolumeProviderCompat.VOLUME_CONTROL_RELATIVE, 100, 50) {
        @Override
        public void onAdjustVolume(int direction) {
          String btn = direction == 1 ? "up" : direction == -1 ? "down" : "unknown";
          long now = System.currentTimeMillis();
          long timeDiff = lastInputTime == 0 ? 0 : now - lastInputTime;
          lastInputTime = now;

          buttonBuffer.add(new ButtonRecord(btn, 0, timeDiff));
          if (buttonBuffer.size() > 10) buttonBuffer.remove(0);

          ButtonGesture matched = recognizeButtonGesture(buttonBuffer, buttonGestures);
          if (matched != null) {
            performAction(matched);
            buttonBuffer.clear();
          }
        }
      };
    mediaSession.setPlaybackToRemote(myVolumeProvider);
    mediaSession.setActive(true);
  }

  private ButtonGesture recognizeButtonGesture(List<ButtonRecord> buffer, List<GestureTypes.CustomG> gestures) {
    for (GestureTypes.CustomG gesture : gestures) {
      for (List<Object> trial : gesture.recordTrials) {
        if (trial.size() == buffer.size()) {
          boolean match = true;
          for (int i = 0; i < trial.size(); i++) {
            ButtonRecord expected = (ButtonRecord) trial.get(i);
            ButtonRecord actual = buffer.get(i);
            if (!expected.button.equals(actual.button)) {
              match = false;
              break;
            }
            // Optionally compare duration/timeDiff here for stricter matching
          }
          if (match) return (ButtonGesture) gesture;
        }
      }
    }
    return null;
  }

  private void performAction(GestureTypes.CustomG gesture) {
    // TODO: Implement what should happen when a gesture is recognized
  }

  @Override
  public IBinder onBind(Intent intent) {
    throw new UnsupportedOperationException("Not yet implemented");
  }
}
