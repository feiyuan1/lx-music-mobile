package cn.toside.music.mobile;

import android.app.Notification;
import android.appwidget.AppWidgetProvider;
import android.service.notification.NotificationListenerService;
import com.facebook.react.ReactInstanceManager;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import cn.toside.music.mobile.utils.SharedPrefUtil;

public class WXNotificationService extends NotificationListenerService {
  private static final String TAG = "PrintNotification";
  private static final String WX_PACKAGE = "com.tencent.mm";

  @Override
  public void onNotificationPosted(StatusBarNotification sbn) {
    String packageName = sbn.getPackageName();

    if(packageName.contains(WX_PACKAGE)){
      String text = sbn.getNotification().extras.getString(Notification.EXTRA_TEXT);
      WechatSharedPrefUtil prefsUtil = new WechatSharedPrefUtil(getApplicationContext());
      int newCount = prefsUtil.getInt() + 1;
      prefsUtil.setInt(newCount);
      updateAllWidgets();
      sendEventToRN("onWeChatMessage");
    }
  }

  private void sendEventToRN(String eventName){
    ReactApplication reactApplication = (ReactApplication) getApplication();
    ReactInstanceManager manager = reactApplication.getReactNativeHost().getReactInstanceManager();
    ReactContext reactContext = manager.getCurrentReactContext();


    if(reactContext == null){
      Log.d(TAG, "reactcontext is null cannot send event");
      return;
    }
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, "");
  }

  private void updateAllWidgets(){
    WechatCountWidgetProvider.updateAllWidgets(getApplicationContext());
  }
}
