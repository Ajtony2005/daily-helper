import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Upload, Key, Save, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Toast = { id: number; type: "success" | "error"; message: string };

const DEFAULTS = {
  fullName: "",
  email: "you@school.edu",
  bio: "",
  googleCalendarKey: "",
  openWeatherKey: "",
  darkByDefault: false,
  notifications: true,
  language: "en",
};

const L: Record<string, Record<string, string>> = {
  en: {
    profile_title: "Profile",
    full_name: "Full name",
    email: "Email",
    bio: "Bio",
    api_settings: "API Settings",
    google_calendar_key: "Google Calendar API Key",
    openweather_key: "OpenWeather API Key",
    test_connection: "Test Connection",
    reset: "Reset",
    save: "Save",
    dark_by_default: "Dark Mode by default",
    enable_notifications: "Enable notifications",
    language: "Language",
    your_name: "Your name",
    email_edit_note: "Email can be edited if needed.",
    profile_saved: "Profile saved.",
    reset_done: "Reset to defaults.",
    api_success: "API connection successful.",
    api_fail: "API connection failed — missing keys.",
    upload_avatar: "Upload avatar",
    remove_avatar: "Remove avatar",
    testing: "Testing...",
    saving: "Saving...",
  },
  hu: {
    profile_title: "Profil",
    full_name: "Teljes név",
    email: "E-mail",
    bio: "Bemutatkozás",
    api_settings: "API beállítások",
    google_calendar_key: "Google Naptár API kulcs",
    openweather_key: "OpenWeather API kulcs",
    test_connection: "Teszt kapcsolódás",
    reset: "Visszaállítás",
    save: "Mentés",
    dark_by_default: "Sötét mód alapértelmezettként",
    enable_notifications: "Értesítések engedélyezése",
    language: "Nyelv",
    your_name: "A neved",
    email_edit_note: "Az e-mail szerkeszthető, ha szükséges.",
    profile_saved: "Profil elmentve.",
    reset_done: "Visszaállítva az alapértékekre.",
    api_success: "API kapcsolat sikeres.",
    api_fail: "API kapcsolat sikertelen — hiányzó kulcsok.",
    upload_avatar: "Avatar feltöltése",
    remove_avatar: "Avatar eltávolítása",
    testing: "Tesztelés...",
    saving: "Mentés...",
  },
};

export default function Profile() {
  const [fullName, setFullName] = useState(DEFAULTS.fullName);
  const [email, setEmail] = useState(DEFAULTS.email);
  const [bio, setBio] = useState(DEFAULTS.bio);

  const [googleCalendarKey, setGoogleCalendarKey] = useState(
    DEFAULTS.googleCalendarKey
  );
  const [openWeatherKey, setOpenWeatherKey] = useState(DEFAULTS.openWeatherKey);

  const [darkByDefault, setDarkByDefault] = useState(DEFAULTS.darkByDefault);
  const [notifications, setNotifications] = useState(DEFAULTS.notifications);
  const [language, setLanguage] = useState<string>(DEFAULTS.language);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);

  useEffect(() => {
    if (!avatarFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(
        typeof e.target?.result === "string" ? e.target?.result : null
      );
    };
    reader.readAsDataURL(avatarFile);
  }, [avatarFile]);

  useEffect(() => {
    // auto-clear toasts after 3.5s
    if (toasts.length === 0) return;
    const t = setTimeout(() => {
      setToasts((s) => s.slice(1));
    }, 3500);
    return () => clearTimeout(t);
  }, [toasts]);

  function pushToast(type: Toast["type"], message: string) {
    setToasts((s) => [...s, { id: toastId.current++, type, message }]);
  }

  const t = (key: string) => {
    const dict = L[language] || L.en;
    return dict[key] ?? key;
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setAvatarFile(f);
  };

  const onChoose = () => fileInputRef.current?.click();

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleTestConnection = () => {
    setTesting(true);
    // mock test: succeed if both keys are non-empty, else fail
    setTimeout(
      () => {
        setTesting(false);
        if (googleCalendarKey.trim() || openWeatherKey.trim()) {
          pushToast("success", t("api_success"));
        } else {
          pushToast("error", t("api_fail"));
        }
      },
      1000 + Math.random() * 800
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(
      () => {
        setSaving(false);
        pushToast("success", t("profile_saved"));
      },
      900 + Math.random() * 600
    );
  };

  const handleReset = () => {
    setFullName(DEFAULTS.fullName);
    setEmail(DEFAULTS.email);
    setBio(DEFAULTS.bio);
    setGoogleCalendarKey(DEFAULTS.googleCalendarKey);
    setOpenWeatherKey(DEFAULTS.openWeatherKey);
    setDarkByDefault(DEFAULTS.darkByDefault);
    setNotifications(DEFAULTS.notifications);
    setLanguage(DEFAULTS.language);
    setAvatarFile(null);
    setAvatarPreview(null);
    pushToast("success", t("reset_done"));
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-4 bg-(--color-background)">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-card w-full max-w-4xl p-6 md:p-10"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Avatar + basic info */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="w-full md:w-1/3 flex flex-col items-center"
          >
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className="relative w-40 h-40 rounded-full overflow-hidden border border-accent flex items-center justify-center bg-surface-variant"
              aria-label={t("upload_avatar")}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-on-surface opacity-80" />
              )}

              <div className="absolute right-2 bottom-2 flex gap-2">
                <button
                  type="button"
                  onClick={onChoose}
                  className="icon-button"
                  title={t("upload_avatar")}
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="icon-button"
                  title={t("remove_avatar")}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setAvatarFile(f);
                }}
              />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-on-surface">
                {fullName || t("your_name")}
              </h3>
              <p className="text-sm text-on-surface opacity-70">{email}</p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="w-full md:w-2/3"
          >
            <h2 className="section-title mb-4">{t("profile_title")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">{t("full_name")}</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field mt-2"
                />
                <p className="text-sm text-on-surface opacity-60 mt-2">
                  {t("email_edit_note")}
                </p>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="bio">{t("bio")}</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-2 min-h-[120px] w-full resize-none"
                />
              </div>
            </div>

            {/* API Settings - collapsible */}
            <details
              className="mt-6 bg-surface-variant border border-accent rounded-md p-4"
              open
            >
              <summary className="flex items-center gap-2 cursor-pointer font-semibold text-on-surface">
                <Key className="w-4 h-4" /> {t("api_settings")}
              </summary>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="gcal">{t("google_calendar_key")}</Label>
                  <div className="relative mt-2">
                    <Input
                      id="gcal"
                      type="password"
                      value={googleCalendarKey}
                      onChange={(e) => setGoogleCalendarKey(e.target.value)}
                      className="input-field w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // toggle visibility by switching type attribute — quick hack
                        const el = document.getElementById(
                          "gcal"
                        ) as HTMLInputElement | null;
                        if (el)
                          el.type =
                            el.type === "password" ? "text" : "password";
                      }}
                      className="absolute right-2 top-2 icon-button"
                      aria-label="Toggle key visibility"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ow">{t("openweather_key")}</Label>
                  <div className="relative mt-2">
                    <Input
                      id="ow"
                      type="password"
                      value={openWeatherKey}
                      onChange={(e) => setOpenWeatherKey(e.target.value)}
                      className="input-field w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(
                          "ow"
                        ) as HTMLInputElement | null;
                        if (el)
                          el.type =
                            el.type === "password" ? "text" : "password";
                      }}
                      className="absolute right-2 top-2 icon-button"
                      aria-label="Toggle key visibility"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    className="btn-outline"
                    onClick={handleTestConnection}
                    disabled={testing}
                  >
                    {testing ? t("testing") : t("test_connection")}
                  </Button>
                  <div className="ml-auto flex gap-2">
                    <Button className="btn-secondary" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" /> {t("reset")}
                    </Button>
                    <Button
                      className="btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="w-4 h-4" />{" "}
                      {saving ? t("saving") : t("save")}
                    </Button>
                  </div>
                </div>
              </div>
            </details>

            {/* Toggles */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={darkByDefault}
                  onCheckedChange={(checked) =>
                    setDarkByDefault(checked as boolean)
                  }
                />
                <span className="text-on-surface">{t("dark_by_default")}</span>
              </Label>

              <Label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={notifications}
                  onCheckedChange={(checked) =>
                    setNotifications(checked as boolean)
                  }
                />
                <span className="text-on-surface">
                  {t("enable_notifications")}
                </span>
              </Label>

              <div>
                <Label htmlFor="lang">{t("language")}</Label>
                <Select
                  value={language}
                  onValueChange={(val: string) => setLanguage(val)}
                >
                  <SelectTrigger
                    id="lang"
                    className="select-trigger mt-2 w-full"
                  >
                    <SelectValue placeholder={t("language")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hu">Magyar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Toasts */}
        <div className="toast-container">
          {toasts.map((tx) => (
            <div
              key={tx.id}
              className={`toast ${tx.type === "success" ? "success" : "error"}`}
            >
              {tx.message}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
