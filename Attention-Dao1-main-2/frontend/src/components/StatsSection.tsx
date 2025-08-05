import { useEffect, useState } from "react";
import { Users, DollarSign, FileText, TrendingUp } from "lucide-react";

const StatsSection = () => {
  const [animatedValues, setAnimatedValues] = useState({
    creators: 0,
    prizeMoney: 0,
    portfolioPosts: 0,
  });

  const finalValues = {
    creators: 12847,
    prizeMoney: 247563,
    portfolioPosts: 89324,
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues({
        creators: Math.floor(finalValues.creators * easeOutQuart),
        prizeMoney: Math.floor(finalValues.prizeMoney * easeOutQuart),
        portfolioPosts: Math.floor(finalValues.portfolioPosts * easeOutQuart),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues(finalValues);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  const stats = [
    {
      icon: Users,
      value: animatedValues.creators,
      label: "Active Creators",
      color: "text-viral-purple",
      bgColor: "bg-viral-purple/10",
    },
    {
      icon: DollarSign,
      value: animatedValues.prizeMoney,
      label: "Total Prize Money Paid Out",
      prefix: "$",
      color: "text-viral-pink",
      bgColor: "bg-viral-pink/10",
    },
    {
      icon: FileText,
      value: animatedValues.portfolioPosts,
      label: "Portfolio Posts",
      color: "text-viral-cyan",
      bgColor: "bg-viral-cyan/10",
    },
    {
      icon: TrendingUp,
      value: 94,
      label: "Success Rate",
      suffix: "%",
      color: "text-viral-blue",
      bgColor: "bg-viral-blue/10",
      isStatic: true,
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Empowering the Next Generation of{" "}
            <span className="viral-gradient bg-clip-text text-transparent">
              Marketing Leaders
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students already building their careers and earning through our viral ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.prefix && stat.prefix}
                  {stat.isStatic ? stat.value : formatNumber(stat.value)}
                  {stat.suffix && stat.suffix}
                </div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 viral-gradient opacity-5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default StatsSection;