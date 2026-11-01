import Image from "next/image";

type ProjectPreviewImageProps = {
	src: string;
};

export function ProjectPreviewImage({ src }: ProjectPreviewImageProps) {
	return (
		<div className="relative aspect-[16/10] w-full bg-muted">
			<Image
				src={src}
				alt=""
				fill
				sizes="288px"
				className="object-cover object-top"
			/>
		</div>
	);
}