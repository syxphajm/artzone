import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export function UserAvatar({ user, className }) {
  // Kiểm tra xem user có tồn tại không và có profile_picture không
  const hasAvatar = user && user.profile_picture

  return (
    <Avatar className={className}>
      {hasAvatar ? (
        <AvatarImage
          src={user.profile_picture}
          alt={user.fullname}
          referrerPolicy="no-referrer" // Thêm thuộc tính này để tránh vấn đề CORS
        />
      ) : (
        <AvatarFallback className="bg-primary/10">
          <User className="h-5 w-5" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

