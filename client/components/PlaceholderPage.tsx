import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConstructionIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  features?: string[];
}

export default function PlaceholderPage({ title, description, features = [] }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-forex-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <div className="mb-8">
              <div className="bg-gradient-to-r from-forex-500 to-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-6">
                <ConstructionIcon className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {description}
              </p>
            </div>

            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Coming Soon:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-gradient-to-r from-forex-50 to-blue-50 p-4 rounded-lg border border-forex-200">
                      <span className="text-gray-700">✓ {feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              
              <a 
                href="https://t.me/forex_traders_signalss" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Join Telegram for Updates
                </Button>
              </a>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Want this page completed?</strong> Continue prompting to request specific features for this section.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
