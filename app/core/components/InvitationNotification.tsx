import { Link } from "blitz"
import moment from "moment"

const InvitationNotification = ({ invited }) => {
  return (
    <>
      <Link href={`/invitations?suffix=${invited.suffix}`}>
        <li className="cursor-pointer p-2">
          <p className="text-xs leading-4 text-gray-400">{moment(invited.updatedAt).fromNow()}</p>
          <p className="text-sm leading-4 font-bold text-gray-900 dark:text-gray-200 mt-2 mb-1">
            {invited.title}
          </p>
          <p className="text-xs leading-4 text-gray-900 dark:text-gray-200 my-1">
            You got invited as co-author!
          </p>
        </li>
      </Link>
    </>
  )
}

export default InvitationNotification
