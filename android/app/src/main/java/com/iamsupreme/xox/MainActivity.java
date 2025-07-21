package com.iamsupreme.xox;

import android.content.Intent;

import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onResume() {
    super.onResume();
    Intent serviceIntent = new Intent(this, MyForegroundService.class);
    stopService(serviceIntent);
  }


  @Override
  public void onStop() {
    super.onStop();
    Intent serviceIntent = new Intent(this, MyForegroundService.class);
    ContextCompat.startForegroundService(this, serviceIntent);
    startService(serviceIntent);
  }

  @Override
  public  void onPause() {
    super.onPause();
    Intent serviceIntent = new Intent(this, MyForegroundService.class);
    ContextCompat.startForegroundService(this, serviceIntent);
    startService(serviceIntent);
  }
}
