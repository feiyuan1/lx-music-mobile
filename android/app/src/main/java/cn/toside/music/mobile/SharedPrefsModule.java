package cn.toside.music.mobile;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import androidx.annotation.NonNull;

import cn.toside.music.mobile.utils.SharedPrefUtil;

public class SharedPrefsModule extends ReactContextBaseJavaModule {
  private final SharedPrefUtil prefsUtil;

  public SharedPrefsModule(ReactApplicationContext context) {
    super(context);
    this.prefsUtil = new SharedPrefUtil(context);
  }

  @NonNull
  @Override
  public String getName() {
    return "SharedRefsModule";
  }

  @ReactMethod
  public void getData_Int(String key, Promise promise) {
    int count = prefsUtil.getInt(key, 0);
    promise.resolve(count);
  }
}
