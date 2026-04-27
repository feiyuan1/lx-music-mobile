package cn.toside.music.mobile;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import cn.toside.music.mobile.utils.SharedPrefUtil;

public class WechatCountWidgetProvider extends AppWidgetProvider {
  @Override
  public void onUpdate(Context context, AppWidgetManager manager, int[] widgetIds){
    for(int widgetId : widgetIds) {
      updateWidget(context, manager, widgetId);
    }
  }

  static void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
    WechatSharedPrefUtil prefsUtil = new WechatSharedPrefUtil(context);
    int count = prefsUtil.getInt();
    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.wechat_count_desktop_widget);

//    更新桌面组件数据
    views.setTextViewText(R.id.wechat_count, String.valueOf(count));

    /*
    为桌面组件添加点击事件
    **/
    Intent intent = new Intent(context, MainActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    PendingIntent pi = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    views.setOnClickPendingIntent(R.id.widget_root, pi);

//    更新桌面组件
    appWidgetManager.updateAppWidget(appWidgetId, views);
  }

  static void updateAllWidgets(Context context) {
    AppWidgetManager manager = AppWidgetManager.getInstance(context);
    int[] appWidgetIds = manager.getAppWidgetIds(new android.content.ComponentName(context, WechatCountWidgetProvider.class));
    for (int appWidgetId : appWidgetIds) {
      updateWidget(context, manager, appWidgetId);
    }
  }
}
