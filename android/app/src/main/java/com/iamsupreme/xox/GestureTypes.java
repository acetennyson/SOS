package com.iamsupreme.xox;

import java.util.List;
import java.util.Map;



public class GestureTypes {

  public class GestureFile {
    public List<GestureTypes.CustomG> gestures;
    public int recordTimeOut;
  }

  public static class CustomG {
    public int id;
    public int gType; // 2 for volume
    public String name;

    public CustomG(int id, int gType, String name) {
      this.id = id;
      this.gType = gType;
      this.name = name;
    }
  }

  // --- Button Gestures ---

  public static class ButtonRecord {
    public String button; // "up" or "down"
    public long duration; // ms
    public long timeDiff; // ms

    public ButtonRecord(String button, long duration, long timeDiff) {
      this.button = button;
      this.duration = duration;
      this.timeDiff = timeDiff;
    }
  }

  public static class ButtonGesture extends CustomG {
    public List<List<ButtonRecord>> recordTrials;

    public ButtonGesture(int id, int gType, String name, List<List<ButtonRecord>> recordTrials) {
      super(id, 2, name);
      this.recordTrials = recordTrials;
    }
  }

  // --- Touch Gestures ---

  public static class TouchRecord {
    public int x, y;
    public long duration;
    public long timeDiff;

    public TouchRecord(int x, int y, long duration, long timeDiff) {
      this.x = x;
      this.y = y;
      this.duration = duration;
      this.timeDiff = timeDiff;
    }
  }

  public static class TouchGesture extends CustomG {
    public int id;
    public int gType; // 3 for touch
    public String name;
    public List<List<TouchRecord>> recordTrials;

    public TouchGesture(int id, int gType, String name, List<List<TouchRecord>> recordTrials) {
      super(id, 1, name);
      this.recordTrials = recordTrials;
    }
  }

  // --- Speech Gestures ---

  public static class SpeechRecord {
    public String text;
    public String lang;

    public SpeechRecord(String text, String lang) {
      this.text = text;
      this.lang = lang;
    }
  }

  public static class SpeechGesture {
    public int id;
    public int gType; // 4 for speech
    public String name;
    public SpeechRecord recordTrials;

    public SpeechGesture(int id, int gType, String name, SpeechRecord recordTrials) {
      this.id = id;
      this.gType = 3;
      this.name = name;
      this.recordTrials = recordTrials;
    }
  }

  // --- Shake Gestures ---

  public static class ShakePhoneRecord {
    public long duration;
    public long timeDiff;
    public String direction;
    public int intensity;
    public Map<String, Object> additional;

    public ShakePhoneRecord(long duration, long timeDiff, String direction, int intensity, Map<String, Object> additional) {
      this.duration = duration;
      this.timeDiff = timeDiff;
      this.direction = direction;
      this.intensity = intensity;
      this.additional = additional;
    }
  }

  public static class ShakePhonesGesture {
    public int id;
    public int gType; // 1 for shake
    public String name;
    public List<List<ShakePhoneRecord>> recordTrials;

    public ShakePhonesGesture(int id, int gType, String name, List<List<ShakePhoneRecord>> recordTrials) {
      this.id = id;
      this.gType = gType;
      this.name = name;
      this.recordTrials = recordTrials;
    }
  }

  // --- System Gestures & Actions ---

  public static class SysGestures {
    public int id;
    public String name;
    public String description;
    public String fontAwesomeIcon;
    public boolean enabled;
  }

  public static class CustomGestures {
    public int id;
    public String name;
    public int sys;
  }

  public static class SysAction {
    public int type;
    public String name;
    public String fontawesomeIcon;
    public String description;
    public boolean enabled;
  }

  public static class CustomAction {
    public int id;
    public String name;
    public int type;
    public Object[] cbArgs;
    public boolean enabled;
    public Map<String, Object> extra;
  }

  public static class CallInput {
    public String name;
    public int type; // 1
    public String[] cbArgs;
  }

  public static class MessageInput {
    public String name;
    public int type; // 2
    public String[] text;
  }

  public static class DefaultInput {
    public String name;
    public Object value;
    public String id;
    public String parentClass;
    public String placeholder;
    public String label;
    public String type;
    public String className;
  }

  public static class OptionalInput {
    public String name;
    public String value;
    public String className;
    public String placeholder;
    public String parentClass;
    public List<Option> options;
    public String label;
    public String id;
    public String type;
  }

  public static class Option {
    public String text;
    public Object value;
  }
}
