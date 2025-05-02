
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Users, Mail, Globe, BookOpen } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const { t } = useTranslation();

  const examTypes = [
    { name: t("exams.toeic"), icon: Calendar, description: "Test of English for International Communication" },
    { name: t("exams.toefl"), icon: Users, description: "Test of English as a Foreign Language" },
    { name: t("exams.hsk"), icon: Globe, description: "Hanyu Shuiping Kaoshi (Chinese Proficiency Test)" },
  ];

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
            <Button size="lg" className="animate-pulse">
              {t("landing.getStarted")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{t("landing.examsOffered")}</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t("landing.heroSubtitle")}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {examTypes.map((exam, index) => (
              <div key={index} className="p-6 bg-card rounded-lg shadow card-hover">
                <exam.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{exam.name}</h3>
                <p className="text-muted-foreground">
                  {exam.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">{t("landing.upcomingEvents")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-card rounded-lg shadow overflow-hidden card-hover">
                <div className="h-40 bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-primary/60" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">TOEIC {item}</h3>
                      <p className="text-sm text-muted-foreground">May {10 + item}, 2025</p>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {t("exams.upcoming")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t("exams.examLocation")}: NRRU Building {item}, Room {100 + item}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    {t("exams.register")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{t("landing.contactUs")}</h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">{t("landing.location")}</h3>
              <p className="text-muted-foreground mb-4">
                340 Suranarai Rd, Nai Mueang, Mueang Nakhon Ratchasima District, Nakhon Ratchasima 30000
              </p>
              
              <h3 className="text-xl font-semibold mb-4 mt-6">{t("landing.email")}</h3>
              <p className="text-muted-foreground mb-4">language@nrru.ac.th</p>
              
              <h3 className="text-xl font-semibold mb-4 mt-6">{t("landing.phone")}</h3>
              <p className="text-muted-foreground mb-4">+66 44 009 009</p>
            </div>
            
            <div className="bg-card rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">{t("landing.sendMessage")}</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder={t("auth.firstName")}
                  className="input-field w-full"
                />
                <input
                  type="email"
                  placeholder={t("auth.email")}
                  className="input-field w-full"
                />
                <textarea
                  placeholder="Your message"
                  className="input-field w-full min-h-[120px]"
                />
                <Button className="w-full">{t("landing.sendMessage")}</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t("common.appName")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("landing.heroSubtitle")}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t("navigation.exams")}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">{t("exams.toeic")}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">{t("exams.toefl")}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">{t("exams.hsk")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t("landing.aboutUs")}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">{t("landing.contactUs")}</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">{t("landing.aboutUs")}</a></li>
                <li>
                  <div className="flex items-center space-x-2 mt-4">
                    <LanguageSwitcher />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
            © 2025 {t("common.appName")}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
