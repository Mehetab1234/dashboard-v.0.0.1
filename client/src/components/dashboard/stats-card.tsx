import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Link } from "wouter";

interface StatsCardProps {
  title: string;
  value: string;
  icon: IconProp;
  iconColor: string;
  linkText?: string;
  linkHref?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  iconColor,
  linkText,
  linkHref,
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 rounded-md p-3 ${iconColor} text-white`}
          >
            <FontAwesomeIcon icon={icon} className="h-5 w-5" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      {linkText && linkHref && (
        <CardFooter className="bg-muted/50 px-6 py-3">
          <Link href={linkHref}>
            <span className="text-sm font-medium text-primary hover:text-primary/80 cursor-pointer">
              {linkText} <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
