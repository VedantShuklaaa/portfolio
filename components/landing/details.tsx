import { faRust } from "@fortawesome/free-brands-svg-icons";
import {faGear} from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Details() {
	return (
		<div className="w-[60vw] h-screen flex flex-col items-start justify-center gap-25 z-100">
			<div className="flex flex-col gap-5">
				<h1 className="text-9xl font-bold">BACKEND <br /> <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-400 dark:from-cyan-600 dark:via-blue-700 dark:to-indigo-800">ENGINEER</span></h1>
				<span>
					<p className="text-xl font-mono">
						Passionate about crafting fast, reliable backends.<br /> Specialize in building scalable products <br />with Rust and Node.js.
					</p>
				</span>
			</div>

			<div className="flex gap-4 font-mono">
				<div className="relative h-[25vh] w-[18vw] border rounded-xl bg-card flex flex-col gap-3 items-start justify-center p-4 ">
					<FontAwesomeIcon icon={faRust} size="3x" className="absolute right-2 bottom-4 animate-pulse" />
					<h1 className="font-bold text-3xl text-start">Rust Backend <br /> Engineer</h1>
					<p className="text-sm">Building fast, reliable, <br /> and scalable APIs and <br /> systems with Rust.</p>
				</div>
				<div className="relative h-[25vh] w-[30vw] border rounded-xl bg-card flex flex-col gap-3 items-start justify-center p-4 ">
				    <FontAwesomeIcon icon={faGear} size="3x" className="absolute right-2 bottom-4 animate-pulse"/>
					<h1 className="font-bold text-3xl text-start">System Architecture</h1>
					<p className="text-sm">Architecting robust, high-performance backends <br/> using clean design patterns and efficient, <br/> scalable APIs to ensure seamless operation, <br/> high availability, and optimal performance in <br/> complex, production-grade environments.</p>
				</div>
			</div>
		</div>
	)
}