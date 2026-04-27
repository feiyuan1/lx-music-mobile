package cn.toside.music.mobile;

import android.content.Context;

import cn.toside.music.mobile.utils.SharedPrefUtil;

public class WechatSharedPrefUtil {
  private static final String KEY = "wx_message";
  private final SharedPrefUtil prefUtil;

  public WechatSharedPrefUtil (Context context) {
    this.prefUtil = new SharedPrefUtil(context);
  }

  public int getInt(){
    return prefUtil.getInt(KEY, 0);
  }

  public void setInt(int value){
    prefUtil.setInt(KEY, value);
  }
}
