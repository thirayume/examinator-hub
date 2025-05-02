
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}

const languageOptions: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "th", label: "Thai", nativeLabel: "ไทย" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(languageOptions[0]);
  
  useEffect(() => {
    const lang = languageOptions.find(
      (lang) => lang.code === i18n.language
    ) || languageOptions[0];
    setCurrentLanguage(lang);
  }, [i18n.language]);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
          <Globe className="h-4 w-4 mr-1" />
          {currentLanguage.nativeLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("common.selectLanguage")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{lang.nativeLabel} ({lang.label})</span>
            {lang.code === i18n.language && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
