import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  XIcon,
  TelegramIcon,
} from "react-share";

type ShareButtonProps = {
  url: string;
  title: string;
  ShareButton:
    | typeof FacebookShareButton
    | typeof TwitterShareButton
    | typeof WhatsappShareButton
    | typeof LinkedinShareButton
    | typeof TelegramShareButton;
  Icon:
    | typeof FacebookIcon
    | typeof TwitterIcon
    | typeof LinkedinIcon
    | typeof WhatsappIcon
    | typeof XIcon
    | typeof TelegramIcon;
  hashtag?: string;
  hashtags?: string[];
  size?: number;
  round?: boolean;
  borderRadius?: number;
  withText?: boolean;
  className?: string;
  invert?: boolean;
  mobile?: boolean;
  text?: string;
  separator?: string;
  withIcon?: boolean;
};

export const SocialButton = ({
  url,
  title,
  hashtag,
  ShareButton,
  Icon,
  size = 24,
  round = true,
  borderRadius = 0,
  withText = true,
  className,
  invert = false,
  text = "Post",
  separator,
  withIcon = false,
}: ShareButtonProps) => (
  <ShareButton
    url={url}
    title={title}
    hashtag={hashtag}
    className={className}
    separator={separator}
  >
    <div
      className={`${withText ? "px-3 py-1.5 rounded-sm" : "px-0 py-0 rounded-md"} flex items-center gap-2 ${invert ? "bg-primary text-secondary" : "bg-secondary text-white"} w-fit`}
    >
      {withIcon && (
        <Icon
          size={size}
          round={round}
          borderRadius={borderRadius}
          iconFillColor="white"
          bgStyle={{ fill: "black" }}
        />
      )}
      {withText && (
        <p className={`${invert ? "text-secondary" : "text-primary"} text-sm`}>
          {text}
        </p>
      )}
    </div>
  </ShareButton>
);

type IndividualButtonProps = {
  url: string;
  title: string;
  hashtag?: string;
  hashtags?: string[];
  size?: number;
  round?: boolean;
  borderRadius?: number;
  withText?: boolean;
  className?: string;
  invert?: boolean;
  mobile?: boolean;
  text?: string;
  separator?: string;
  withIcon?: boolean;
};

export const FacebookButton = ({
  url,
  title,
  hashtag,
  size = 24,
  round = true,
  borderRadius = 6,
  withText = true,
  className,
  invert = false,
  withIcon = true,
}: IndividualButtonProps) => (
  <SocialButton
    url={url}
    title={title}
    hashtag={hashtag}
    className={className}
    ShareButton={FacebookShareButton}
    Icon={FacebookIcon}
    size={size}
    round={round}
    withText={withText}
    invert={invert}
    withIcon={withIcon}
    borderRadius={borderRadius}
    text="FaceBook"
  />
);

export const TwitterButton = ({
  url,
  title,
  hashtags,
  size = 24,
  round = true,
  borderRadius = 6,
  withText = true,
  className,
  invert = false,
  withIcon = true,
}: IndividualButtonProps) => (
  <SocialButton
    url={url}
    title={title}
    hashtags={hashtags}
    className={className}
    ShareButton={TwitterShareButton}
    Icon={XIcon}
    size={size}
    round={round}
    borderRadius={borderRadius}
    withText={withText}
    invert={invert}
    text="Twitter"
    withIcon={withIcon}
  />
);

export const LinkedInButton = ({
  url,
  title,
  size = 24,
  round = true,
  borderRadius = 6,
  withText = true,
  className,
  invert = false,
  withIcon = true,
}: IndividualButtonProps) => (
  <SocialButton
    url={url}
    title={title}
    className={className}
    ShareButton={LinkedinShareButton}
    Icon={LinkedinIcon}
    size={size}
    round={round}
    borderRadius={borderRadius}
    withText={withText}
    invert={invert}
    withIcon={withIcon}
    text="LinkedIn"
  />
);

export const WhatsAppButton = ({
  url,
  title,
  separator = ": ",
  size = 24,
  round = true,
  borderRadius = 6,
  withText = true,
  className,
  invert = false,
  withIcon = true,
}: IndividualButtonProps) => (
  <SocialButton
    url={url}
    title={title}
    separator={separator}
    className={className}
    ShareButton={WhatsappShareButton}
    Icon={WhatsappIcon}
    size={size}
    round={round}
    borderRadius={borderRadius}
    withText={withText}
    invert={invert}
    withIcon={withIcon}
    text="WhatsApp"
  />
);

export const TelegramButton = ({
  url,
  title,
  size = 24,
  round = true,
  borderRadius = 6,
  withText = true,
  className,
  invert = false,
  withIcon = true,
}: IndividualButtonProps) => (
  <SocialButton
    url={url}
    title={title}
    className={className}
    ShareButton={TelegramShareButton}
    Icon={TelegramIcon}
    size={size}
    round={round}
    borderRadius={borderRadius}
    withText={withText}
    invert={invert}
    withIcon={withIcon}
    text="Telegram"
  />
);
