"use client"
import Carousel from 'react-bootstrap/Carousel';

interface Slide {
    imageUrl: string;
}

const HeroSection = () => {
    const slides: Slide[] = [
        { imageUrl: "/images/restaurantImages/aruma.jpg" },
        { imageUrl: "/images/restaurantImages/bakmi_palu.jpg" },
        { imageUrl: "/images/restaurantImages/bakso_afung.jpg" },
        { imageUrl: "/images/restaurantImages/bebek_Carok.jpg" },  
        { imageUrl: "/images/restaurantImages/bebek_sinjay.PNG" },
        { imageUrl: "/images/restaurantImages/bima.png" },
        { imageUrl: "/images/restaurantImages/bli_gung.webp" },
        { imageUrl: "/images/restaurantImages/dapur_solo.jpg" },
        { imageUrl: "/images/restaurantImages/denai.webp" },
        { imageUrl: "/images/restaurantImages/gado_cemara.png" },
        { imageUrl: "/images/restaurantImages/gerobak_betawi.png" },
        { imageUrl: "/images/restaurantImages/java_kitchen.jpg" },
        { imageUrl: "/images/restaurantImages/kafe_betawi.jpg" },
        { imageUrl: "/images/restaurantImages/lapis.png" },
        { imageUrl: "/images/restaurantImages/leko.png" },
        { imageUrl: "/images/restaurantImages/made.png" },
        { imageUrl: "/images/restaurantImages/migor.png" },
        { imageUrl: "/images/restaurantImages/mlinjo.jpg" },
        { imageUrl: "/images/restaurantImages/naspad.png" },
        { imageUrl: "/images/restaurantImages/padang_merdeka.jpg" },
        { imageUrl: "/images/restaurantImages/padang_sederhana.jpg" },
        { imageUrl: "/images/restaurantImages/pagi_sore.png" },
        { imageUrl: "/images/restaurantImages/payakumbuh.jpg" },
        { imageUrl: "/images/restaurantImages/remboelan.png" },
        { imageUrl: "/images/restaurantImages/rempah_bistro.png" },
        { imageUrl: "/images/restaurantImages/rumarasa_nusan.png" },
        { imageUrl: "/images/restaurantImages/sate_khas_senayan.jpg" },
        { imageUrl: "/images/restaurantImages/seribu_rasa.jpg" },
        { imageUrl: "/images/restaurantImages/sop_ikan_batam.png" },
        { imageUrl: "/images/restaurantImages/soto_h_mamat.jpg" },
        { imageUrl: "/images/restaurantImages/soto_h_maruf.jpg" },
        { imageUrl: "/images/restaurantImages/soto_kudus.jpg" },
        { imageUrl: "/images/restaurantImages/soto_ngatidjo.png" },
        { imageUrl: "/images/restaurantImages/taliwang.jpg" },      
    ]

    return (
        <Carousel fade interval={ 4000 } data-bs-theme="dark" indicators={false} controls={false}>
            { slides.map((slide, index) => (
                <Carousel.Item key={ index }>
                    <div
                        style={{
                            backgroundImage:`url(${ slide.imageUrl})`,
                            backgroundSize:"cover",
                            backgroundPosition:"center",
                            width: "100%",
                            height:"",
                        }}>
                    </div>
                </Carousel.Item>
            )
            )}
        </Carousel>
    )
}

export default HeroSection;