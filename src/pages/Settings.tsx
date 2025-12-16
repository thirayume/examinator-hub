
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { WebsiteSettings } from "@/types/website";
import { sanitizeError, logError } from "@/lib/error-utils";

const Settings = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      logError('fetchSettings', error);
      toast({
        title: t("common.error"),
        description: sanitizeError(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("website_settings")
        .update({
          institute_name: settings.institute_name,
          hero_title: settings.hero_title,
          hero_subtitle: settings.hero_subtitle,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast({
        title: t("common.success"),
        description: t("common.success"),
      });
    } catch (error) {
      logError('handleSave:settings', error);
      toast({
        title: t("common.error"),
        description: sanitizeError(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>{t("common.loading")}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("navigation.settings")}</h1>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t("common.loading") : t("common.save")}
          </Button>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="institute_name">{t("common.appName")}</Label>
            <Input
              id="institute_name"
              value={settings?.institute_name ?? ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, institute_name: e.target.value } : null
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_title">{t("landing.heroTitle")}</Label>
            <Input
              id="hero_title"
              value={settings?.hero_title ?? ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, hero_title: e.target.value } : null
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">{t("landing.heroSubtitle")}</Label>
            <Textarea
              id="hero_subtitle"
              value={settings?.hero_subtitle ?? ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, hero_subtitle: e.target.value } : null
                )
              }
              rows={3}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
