export function CommentIcon({ className, color = "#716F6C" }: { className?: string; color?: string }) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M6.25 8.125V9.375H7.5V8.125H6.25Z" fill={color}/>
      <path d="M9.375 9.375V8.125H10.625V9.375H9.375Z" fill={color}/>
      <path d="M12.5 8.125V9.375H13.75V8.125H12.5Z" fill={color}/>
      <path fillRule="evenodd" clipRule="evenodd" d="M18.125 3.125H1.875V14.375H3.75V18.6964L8.07138 14.375H18.125V3.125ZM3.125 13.125V4.375H16.875V13.125H7.55362L5 15.6786V13.125H3.125Z" fill={color}/>
    </svg>
  )
}

