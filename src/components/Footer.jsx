export default function Footer() {
  return (
    <footer className="bg-brown/10 mt-auto py-6">
      <div className="max-w-4xl mx-auto px-4 text-center text-brown/70">
        <p className="font-display">Made with love for He Who Shall Not Be Named</p>
        <p className="text-sm mt-1">The Brown Family &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
