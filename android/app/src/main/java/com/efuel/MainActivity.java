package com.efuel;
import android.os.Bundle; // enable proper functioning of react-native screens on android

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
  /* enable proper functioning of react-native screens on android
    This change is required to avoid crashes related to View state being not persisted consistently across Activity restarts.
  */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "E-Fuel";
  }
}
