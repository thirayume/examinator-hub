
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Users, Mail } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">{t("common.appName")}</h1>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
              {t("common.login")}
            </Link>
            <Link to="/auth">
              <Button>{t("common.register")}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("landing.heroTitle")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("landing.heroSubtitle")}
          </p>
          <Link to="/auth">
            <Button size="lg" className="animate-bounce">
              {t("landing.getStarted")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">{t("landing.featuresTitle")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg shadow card-hover">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("exams.toeic")}</h3>
              <p className="text-muted-foreground">
                Test of English for International Communication
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow card-hover">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("exams.toefl")}</h3>
              <p className="text-muted-foreground">
                Test of English as a Foreign Language
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow card-hover">
              <Mail className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t("exams.hsk")}</h3>
              <p className="text-muted-foreground">
                Hanyu Shuiping Kaoshi (Chinese Proficiency Test)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{t("common.appName")}</h2>
          <div className="max-w-md mx-auto bg-card rounded-lg shadow p-6">
            <p className="text-muted-foreground mb-4">
              {t("landing.heroSubtitle")}
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder={t("auth.email")}
                className="input-field w-full"
              />
              <textarea
                placeholder="Your message"
                className="input-field w-full min-h-[100px]"
              />
              <Button className="w-full">{t("common.register")}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 {t("common.appName")}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
