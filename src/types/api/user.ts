export type CurrentUserInfo = {
    userId: string;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    statusMessage: string | null;
    role: string;
    themeMode: string | null;
    notificationsEmail: boolean;
    notificationsPush: boolean;
    digestWeekly: boolean;
    profileVisible: boolean;
    locale: string | null;
};
