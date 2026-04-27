package cn.toside.music.mobile.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SharedPrefUtil {
  private static final String PERF_NAME = "LX_MUSIC";
  private final SharedPreferences prefs;

  public SharedPrefUtil(Context context) {
    this.prefs = context.getSharedPreferences(PERF_NAME, Context.MODE_PRIVATE);
  }

  public int getInt(String key, int defaultValue){
    return prefs.getInt(key, defaultValue);
  }

  public void setInt(String key, int value) {
    prefs.edit().putInt(key, value).apply();
  }
}
