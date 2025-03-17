import Image from 'next/image';

export default function ProfileView({ user, onEdit }: { user: any; onEdit: () => void }) {
    const getFallbackAvatar = () => {
        return user?.nickname ? user.nickname.charAt(0).toUpperCase() : "?";
    };

    const profileImageSrc = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `/uploads/${user.profileImage}`)
        : null;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4">내 정보</h2>

            <div className="flex flex-col items-center mb-4">
                {profileImageSrc ? (
                    <Image src={profileImageSrc} alt="프로필 이미지" width={100} height={100} className="rounded-full object-cover" />
                ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-700 text-2xl font-bold">
                            {getFallbackAvatar()}
                        </span>
                    </div>
                )}
            </div>

            <p className="text-gray-700 mb-2">닉네임: {user?.nickname}</p>
            <p className="text-gray-500 mb-4">상태 메시지: {user?.statusMessage || "등록된 상태 메시지가 없습니다."}</p>

            <button className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md" onClick={onEdit}>
                수정하기
            </button>
        </div>
    );
}
