import Link from "next/link";
import moment from "moment"

const InvitationNotification = ({ invited }) => {
  return (
    <>
      <Link href={`/invitations?suffix=${invited.suffix}`}>
        <li className="cursor-pointer p-2">
          <p className="text-xs leading-4 text-gray-400">{moment(invited.updatedAt).fromNow()}</p>
          <p className="mt-2 mb-1 text-sm font-bold leading-4 text-gray-900 dark:text-gray-200">
            {invited.title}
          </p>
          <p className="my-1 text-xs leading-4 text-gray-900 dark:text-gray-200">
            You got invited as co-author!
          </p>
        </li>
      </Link>
    </>
  )
}

export default InvitationNotification
