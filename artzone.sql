-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2025 at 06:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `artzone`
--

-- --------------------------------------------------------

--
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `pseudonym` varchar(255) DEFAULT NULL,
  `year_of_birth` varchar(255) NOT NULL,
  `place_of_birth` varchar(255) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `education_training` text NOT NULL,
  `main_art_style` varchar(255) NOT NULL,
  `about_me` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`id`, `users_id`, `pseudonym`, `year_of_birth`, `place_of_birth`, `nationality`, `education_training`, `main_art_style`, `about_me`) VALUES
(1, 14, 'kthuy', '2006', 'bp', 'vn', 'kb', 'abstract', 'xinh dep kich tran'),
(4, 24, '', '2007', 'Melbourne, Australia', 'Australia', 'I started drawing at the age of 9 months under the guidance of my father, artist Michael Andre. I did not have any formal training but developed my skills through practice and free creation.', 'abstract', 'Aelita has been dubbed the \"little Picasso\" for her ability to paint abstractly from a very young age. She finds inspiration in animals, documentaries, and the universe, then expresses them in colorful and creative works.'),
(5, 25, '', '1968', 'Valenciennes, France', 'France', 'Eric Bruni\'s passion for painting began in childhood, when he showed a special talent for drawing.', 'realism', 'Eric Bruni is a talented French painter who has exhibited his work in the United States and Asia. Touched by nature with all its promise and assurance, he brings his own style of poetic symbolic landscapes to his colorful and sensitive works.'),
(6, 26, '', '1972', 'Da Nang, Viet Nam​', 'Viet Nam', 'Graduated with a Bachelor of Oil Painting from Ho Chi Minh City University of Fine Arts in 1998​', 'impressionism', 'Graduated with a Bachelor of Oil Painting from Ho Chi Minh City University of Fine Arts in 1998.'),
(7, 27, '', '1991', 'Ngoc Trao Commune, Thach Thanh District, Thanh Hoa Province, Vietnam', 'Viet Nam', 'Bui Hoang Duong studied calligraphy and painting in China, and spent time living and painting in Australia', 'abstract', 'Duong Bui, a Vietnamese artist, expresses himself through watercolor on traditional Do paper. His technique, combining local media with watercolor, creates styles rich in heritage and contemporary nuances. Bui’s works are soulful interpretations, radiating the pure passion from his heart.'),
(8, 28, '', '1997', 'Santiago, Chile', 'Chile', 'self-study', 'minimalism', 'Gustavo Leutun is an emerging artist from Chile whose work has been exhibited in local solo exhibitions. Leutun began painting at the age of 9 and has been pursuing his passion ever since. Inspired by everyday scenes, Leutun paints the vibrant world and people around him in vibrant shades of orange, pink and yellow. He says that each painting is a reflection of his personality and he knows his painting is complete when he feels happy, achieving his ultimate goal of being himself.'),
(9, 29, '', '1897', 'Maroc', 'Maroc', 'self-study', 'expressionism', 'Nadia Abbadi describes herself as a painter and embroiderer, using art to tell stories and capture memories and dreams on canvas.'),
(10, 30, '', '1898', 'Virtue', 'Virtue', 'self-study', 'surrealism', 'Andreas Noßmann describes himself as a painter and illustrator, always drawn to emotional or disturbing subjects, with a need for \"perfect graphic execution\".'),
(11, 31, '', '1958', 'Lyon, France​', 'France​', 'Born into a family passionate about art, Agnès was exposed to painting from a young age and developed her skills through personal practice and study.', 'cubism', 'Agnès Tiollier shares that “The gift of color and the search for its intensity of light allows me to convey the beauty that surrounds us with lightness and playfulness.”');

-- --------------------------------------------------------

--
-- Table structure for table `artworks`
--

CREATE TABLE `artworks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` varchar(255) NOT NULL,
  `image` text NOT NULL,
  `dimensions` varchar(255) NOT NULL,
  `material` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `upload_date` datetime NOT NULL,
  `artists_id` int(11) NOT NULL,
  `status` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artworks`
--

INSERT INTO `artworks` (`id`, `title`, `description`, `price`, `image`, `dimensions`, `material`, `category_id`, `upload_date`, `artists_id`, `status`) VALUES
(15, 'The Unexpected Friends of a Magical World', 'Aelita loves using dinosaurs in her paintings to explore in a dramatic and playful way (using toys) the idea that all creatures live in harmony and that the world is our place of innocence, purity, and magic.', '1900', '/uploads/1742438789538-304285436.jpeg,/uploads/1742438789545-488905164.jpeg,/uploads/1742438789549-148291717.jpeg,/uploads/1742438789551-550156573.jpeg', '25.4x25.4cm', 'Acrylic on canvas', 1, '2025-03-20 02:46:29', 4, 1),
(16, 'The Magical Emerging Life of the Earth', 'In this work, I tap into the vitality of nature, mixing acrylic paint with found objects to create an abstract painting. My strokes exude a freedom of expression, capturing the raw emotion of life emerging. Its explosion of color and texture is designed to infuse the space with a refreshing spirit, evoking contemplation and wonder in all who see it.', '2000', '/uploads/1742862801195-470265040.jpeg,/uploads/1742862801212-669805917.jpeg,/uploads/1742862801216-639727168.jpeg', '76.2x76.2cm', 'Acrylic, Object on canvas', 1, '2025-03-25 00:33:21', 4, 1),
(17, 'Reality Turning Unto Itself in a Ballet of Unintertwining Intering', 'Aelita creates this work of art as a piece of her universe, showing the infinitesimal connection that everything has to its inherent connection and the ability to change everything on every wavelength of the universe - in its intrinsic disregard for the perception of its scale, and that reality is always a Mandelbrot of everything it is not, expressed in vivid, instinctive, ballet-like colors.', '2300', '/uploads/1742863268650-687272627.png', '90x90cm', 'Acrylic, Collage on Canvas', 1, '2025-03-25 00:41:08', 4, 1),
(18, 'The Striding webs of the Cosmic and Perceptive Sea', 'This work of art shows in an expressive way how our vision of the surrounding surface objects and situations combine to form a reality that is perceived in a certain way based only on the aspect we see, while in reality there is much more to it, and the entire universe is infinitely small, there is always something new to see and the beauty is almost incomprehensible.', '3000', '/uploads/1742902772314-827874049.jpeg,/uploads/1742902772317-168193858.jpeg,/uploads/1742902772319-111746060.png,/uploads/1742902772324-346172742.png', '61x45.7cm', 'Acrylic, Collage on Canvas', 1, '2025-03-25 11:39:32', 4, 1),
(19, 'The Flames of the Perception of and Within and Outside of the Footprints of Time', 'Aelita composed this piece with the idea that time is what consciousness perceives, and this involves the imprint and trace of time, the manifestation of everything. Consciousness is part of the very act of time, and its flame is eternal, for every movement exists with a place of memory and the future is based on the past and the present, this is a continuous cycle that allows for time and consciousness.', '1100', '/uploads/1742903009360-512374136.jpeg,/uploads/1742903009362-622698220.jpeg,/uploads/1742903009364-601264301.png', '50,8x50,8cm', 'Acrylic on canvas', 1, '2025-03-25 11:43:29', 4, 1),
(20, 'The Minds\' Imprints Unto the Sky', 'This work of art demonstrates the mind\'s impact on perceived objects and the notion of beauty, its perception and the extent to which our objects of observation and our perspective are completely determined by our minds, and whether this filtering or changing nature is a reflection of our pride in understanding, of being all that exists in thought, or whether changing our perspective and opinions is the only means by which one can truly translate the full beauty of reality into our language, is emotion. This work of art raises the question of whether the intense magic felt when looking at the infinite is insight or the greatness of the brain.', '1290', '/uploads/1742903203750-965796941.jpeg,/uploads/1742903203751-839711990.jpeg,/uploads/1742903203752-440270343.jpeg,/uploads/1742903203754-837861471.png', '59,7x45,7cm', 'Acrylic, Collage on Canvas', 1, '2025-03-25 11:46:43', 4, 1),
(21, 'The Portal of the Infinite Dimensions #08', 'Aelita Andre imaginatively visualizes philosophical ideas and expresses, deeply complex concepts of theoretical physics in her vibrant, colorful and monumental paintings. In this series, Aelita visualizes the concept that all matter in the universe - at its deepest level - vibrates into sound, and that our universe is a vast cosmic symphony and that at this deepest subatomic level, vibrating strings of energy act as portals - to travel to other dimensions. Thus, the beauty of art and the greatness of science are perfectly united and harmonized in his extraordinary works. Each painting exists in its own dimension, acting as a unique representation of that concept.', '2400', '/uploads/1743035584182-541057989.jpeg,/uploads/1743035584202-907323573.jpeg,/uploads/1743035584207-302583836.jpeg,/uploads/1743035584211-285965791.jpeg', '50,8x40,6cm', 'Acrylic on canvas', 1, '2025-03-27 00:33:04', 4, 1),
(22, 'La belle bleue', 'Mediterranean landscape with umbrella pines and cypresses. Technique: Knife and oil on linen. The painting is protected with a layer of gloss varnish. The edges of the canvas are painted black and do not need to be framed.\r\nAs a sky painter, an interpreter of nature, Bruni Eric has succeeded in capturing all the tenderness of nature in his paintings.\r\nThe colors are often amplified, the range is sometimes limited, sometimes expanded according to inspiration. The artist focuses on the colors and movements of the air, giving life and breath to the painting.', '1200', '/uploads/1743037080692-938412303.jpeg,/uploads/1743037080694-459926701.jpeg,/uploads/1743037080697-590215930.jpeg,/uploads/1743037080700-404302421.jpeg', '92x73cm', 'Oil on canvas', 2, '2025-03-27 00:58:00', 5, 1),
(23, 'Le chemin vers les nuages', 'This work depicts a colorful fantasy landscape with windblown clouds. Provence Landscape - 3D Knife Painting on Canvas\r\nIn this work, I sought to capture the drive towards infinity, where the earth embraces the sky. Using acrylic and oil paint, I have rendered a landscape that is both surreal and profound, full of raw emotion. Between expressionism and surrealism, this painting is an invitation to embark on an inner journey, stimulating the imagination and bringing a comforting and inspiring energy to any living space.', '1400', '/uploads/1743037438832-431487277.jpeg,/uploads/1743037438849-286630303.jpeg,/uploads/1743037438861-92844151.jpeg,/uploads/1743037438869-266617191.jpeg,/uploads/1743037438876-903866137.jpeg', '80x80cm', 'Acrylic, Oil on canvas', 2, '2025-03-27 01:03:58', 5, 1),
(24, 'Entre mer et ciel', 'In this piece, I wanted to capture the ephemeral nature of the sky and sea. Using acrylics, I breathed life into impressionistic and abstract movements, creating a dialogue between reality and fantasy. Shades of blue blend into the horizon as golden rays reflect the fiery heat of the setting sun. This painting evokes deep serenity and encourages contemplation, bringing a calm and inspiring atmosphere to your home interior.', '1300', '/uploads/1743037733180-669793014.jpeg,/uploads/1743037733188-208063063.jpeg,/uploads/1743037733204-513492479.jpeg,/uploads/1743037733224-998265420.jpeg,/uploads/1743037733232-65378836.jpeg', '80x80cm', 'Acrylic on canvas', 2, '2025-03-27 01:08:53', 5, 1),
(25, 'Champ de Colza en Avril', 'As a painter of the sky, an interpreter of nature, Bruni Eric has succeeded in capturing all the tenderness of nature in his paintings.\r\nThe colors are often amplified, the range is sometimes limited, sometimes expanded according to the artist\'s inspiration, the emphasis is placed on the color and movement of the air that creates the full expression of its vitality and breath.', '2000', '/uploads/1743037902501-823627382.jpeg,/uploads/1743037902515-605113190.jpeg,/uploads/1743037902528-818854642.jpeg,/uploads/1743037902536-236949142.jpeg', '65x92cm', 'Oil on canvas', 2, '2025-03-27 01:11:42', 5, 1),
(26, 'Scattered poppies', 'As a painter of the sky, an interpreter of nature, Bruni Eric has succeeded in capturing all the tenderness of nature in his paintings.\r\nThe colors are often amplified, the range is sometimes limited, sometimes expanded according to the artist\'s inspiration, the emphasis is placed on the color and the movement of air that gives the painting its vitality and breath.', '2600', '/uploads/1743038003097-28316488.jpeg', '100x100cm', 'Acrylic, Oil on canvas', 2, '2025-03-27 01:13:23', 5, 1),
(27, 'Untitled', 'In this work, I explore the complexity of our inner emotions through intense abstraction on black and white canvas. Using acrylic and oil paint, I create a dialogue between order and chaos, where the intertwining lines represent the constant flow of our thoughts and emotions. This is an invitation to contemplate and find beauty in the labyrinth of our minds. This painting will bring a vibrant and profound energy to any living space.', '1230', '/uploads/1743038331856-734611813.jpeg,/uploads/1743038331887-431809883.jpeg,/uploads/1743038331898-472671708.jpeg,/uploads/1743038331902-382797177.jpeg', '80x80cm', 'Acrylic, Oil on canvas', 1, '2025-03-27 01:18:51', 5, 1),
(28, 'L\'amandier en fleurs', 'As a painter of the sky, an interpreter of nature, Bruni Eric has succeeded in capturing all the tenderness of nature in his paintings.\r\nThe colors are often amplified, the range is sometimes limited, sometimes expanded according to the artist\'s inspiration, the emphasis is placed on the color and the movement of air that gives the painting its vitality and breath.', '1400', '/uploads/1743038566815-140800504.jpeg,/uploads/1743038566822-576784472.jpeg,/uploads/1743038566840-759395297.jpeg,/uploads/1743038566845-725232709.jpeg', '60x73cm', 'Oil on canvas', 2, '2025-03-27 01:22:46', 5, 1),
(29, 'Interlude', 'In this vibrant piece, I have combined acrylics to create an emotional dance of color and form. The painting is abstract with semi-abstract and figurative nuances, an intense expression of conflicting emotions - a visual clash between dream and reality. Warm and cool colors interact with each other, creating an intriguing dynamic. It will bring a warm energy and a touch of unsolved mystery to your space.', '1000', '/uploads/1743039421176-540433162.jpeg,/uploads/1743039421184-430625006.jpeg,/uploads/1743039421201-362641182.jpeg,/uploads/1743039421208-92726725.jpeg', '60x73cm', 'Acrylic on canvas', 1, '2025-03-27 01:37:01', 5, 1),
(30, 'Le rocher de la Baume - Prés de Sisteron.', 'As a painter of the sky, an interpreter of nature, Bruni Eric has succeeded in capturing all the tenderness of nature in his paintings.\r\nThe colors are often amplified, the range is sometimes limited, sometimes expanded according to the artist\'s inspiration, the emphasis is placed on the color and the movement of air that gives the painting its vitality and breath.', '900', '/uploads/1743039907382-70936960.jpeg', '50x70cm', 'Acrylic on canvas', 2, '2025-03-27 01:45:07', 5, 1),
(31, 'Le poisson jaune', 'Canvas painting depicts an exotic orange-yellow fish. The work is protected with a glossy varnish. The edges of the canvas are painted black, allowing it to be hung without a frame. Frame optional.', '850', '/uploads/1743040067452-428397108.jpeg,/uploads/1743040067468-160102527.jpeg,/uploads/1743040067475-612205130.jpeg,/uploads/1743040067480-539863139.jpeg', '61x50cm', 'Acrylic, Oil on canvas', 2, '2025-03-27 01:47:47', 5, 1),
(32, 'Nuages turbulents et bateaux blancs', 'In this work, I seek to capture the essence of chaos and ephemeralness through expressive brushstrokes and vibrant colors. The acrylic medium allows me to explore the duality between the serenity of the white boats and the dynamism of the moving clouds. This is a vibrant painting, expressing passion and provoking reflection on the fleeting beauty of the moment. It will bring vibrant energy and a touch of reflection to any space.', '700', '/uploads/1743040335543-649772726.png', '50x61cm', 'Acrylic on canvas', 2, '2025-03-27 01:52:15', 5, 1),
(33, 'Rêveries Lavandes', 'This painting depicts a typical Provencal scene, bathed in warm, soft light. In the foreground is a vast field of lavender stretching to the horizon, forming regular rows of purple flowers that contrast with the bright yellow of the other wildflowers. This angle makes you feel as if you could lose yourself in this ocean of color.', '680', '/uploads/1743040604420-285720157.jpeg,/uploads/1743040604423-747521199.jpeg,/uploads/1743040604427-29452913.jpeg,/uploads/1743040604429-605340020.jpeg,/uploads/1743040604431-321938.jpeg', '50x60cm', 'Acrylic, Oil on canvas', 2, '2025-03-27 01:56:44', 5, 1),
(34, 'Street No.01', 'I was born into a generation when the country was on the brink of reform. They inherited the traditions of the old Hanoians and accepted the new culture.\r\nThe architecture is a fusion of Eastern and Western cultures...', '1000', '/uploads/1743041831143-265981897.jpeg,/uploads/1743041831146-53272758.jpeg,/uploads/1743041831148-95915594.jpeg,/uploads/1743041831150-185066727.jpeg', '100x70cm', 'Acrylic on canvas', 1, '2025-03-27 02:17:11', 6, 1),
(35, 'Sunshine on heritage ', 'The magic of the island\'s natural sculptures blends with the sea, water and clouds to create an incredibly magnificent beauty. The autumn sunlight shines on the water and cliffs in a brilliant yellow, bringing rich and vibrant transformations here.', '1100', '/uploads/1743041980177-581316070.jpeg,/uploads/1743041980179-443547939.jpeg,/uploads/1743041980181-920424111.jpeg,/uploads/1743041980183-345718713.jpeg', '70x90cm', 'Acrylic on canvas', 1, '2025-03-27 02:19:40', 6, 1),
(37, 'DAWN ON HALONG BAY NO.08', 'The sun rose behind the mountains. The mist began to lift. The first rays of the sun played with sparkling colors on the water. The fishing village woke up. Smoke from the fires was like a thin scarf hugging the mountains.', '1000', '/uploads/1743042843616-683481397.jpeg,/uploads/1743042843618-429842614.jpeg,/uploads/1743042843619-445563280.jpeg,/uploads/1743042843621-279602809.jpeg', '70x100cm', 'Acrylic on canvas', 1, '2025-03-27 02:34:03', 6, 1),
(38, 'Ha Long Bay No.60', 'As the vegetation on the cliffs rises, pure and vigorous buds sprout from the trees. The rows of trees and mountains intertwine, creating large lakes like giant mirrors reflecting sparkling light. The rugged, rugged mountain ranges suddenly become soft and delicate like thousands of colorful pearls, blending into the endless and quiet space. Spring has come to Ha Long Bay.', '1200', '/uploads/1743043116372-745017593.jpeg,/uploads/1743043116374-215166546.jpeg,/uploads/1743043116376-376068517.jpeg,/uploads/1743043116378-212931776.jpeg,/uploads/1743043116380-989389499.jpeg', '80x100cm', 'Acrylic on canvas', 1, '2025-03-27 02:38:36', 6, 1),
(39, 'Red Connect', 'People around me spend a lot of time online, installing apps and finding ways to engage in social media to interact and express themselves. This action sometimes feels like essential nutrition to sustain life.', '960', '/uploads/1743045152634-237040993.jpeg,/uploads/1743045152636-836037528.jpeg,/uploads/1743045152640-976700552.jpeg,/uploads/1743045152642-474330942.jpeg', '70x100cm', 'Acrylic, Clay on canvas', 1, '2025-03-27 03:12:32', 6, 1),
(40, 'HALONG BAY NO.20', 'With vibrant acrylics, I capture the serene majesty of nature’s grandeur, where deep blues and vibrant brushstrokes evoke the mystical essence of majestic landscapes. My passionate energy is woven into each layer, creating an immersive experience that brings both quiet and dynamic energy into your space, inviting contemplation and inner peace.', '940', '/uploads/1743047574318-902544545.png', '69x120cm', 'Acrylic on canvas', 1, '2025-03-27 03:52:54', 6, 1),
(41, 'Peacful Day No.04', 'In this acrylic symphony, I have poured my soul into creating a textural dance of color and light. Each brushstroke captures the essence of movement and emotion, combining the fine art with the rawness of the primitive, the dynamism of expressionism and the gentle echoes of impressionism. This is a work that evokes contemplation, stirs the mind and brings depth to any space it adorns.', '970', '/uploads/1743047713852-433321588.jpeg,/uploads/1743047713855-242551532.jpeg,/uploads/1743047713856-218964506.jpeg,/uploads/1743047713858-408686809.jpeg,/uploads/1743047713859-708412516.jpeg', '60x120cm', 'Acrylic on canvas', 1, '2025-03-27 03:55:13', 6, 1),
(42, 'Green Lotus', 'In creating this piece, I have tapped into the living spirit of nature, expressing its essence through playful brushstrokes and vibrant colours. The acrylic dances across the canvas, capturing a moment of enchanting stillness yet brimming with dynamic movement. It is an ode to the vitality of life, an invitation to growth and renewal: each brushstroke is an echo of life. This work of art embodies a harmonious energy that will bring a sense of peace and inspiration to any space.', '870', '/uploads/1743047855992-733971286.jpeg,/uploads/1743047855994-47502877.jpeg,/uploads/1743047855995-442495677.jpeg,/uploads/1743047855996-718107556.jpeg', '70x50cm', 'Acrylic on canvas', 1, '2025-03-27 03:57:36', 6, 1),
(43, 'The tropics 1', 'In this piece, I have used watercolor on paper to express the passionate nature of the tropics. Each stroke is a pulse, alive, wild, free. I layer and blend the colors to evoke a sun-drenched scene, bursting with color. Bringing this piece of art into your home is an invitation to warmth and vitality, a daily reminder of the endless energy and beauty of abstract nature.', '498', '/uploads/1743055689040-760936890.png', '75x100cm', 'Watercolor on paper', 1, '2025-03-27 06:08:09', 7, 1),
(44, 'The tropics 2', 'In this watercolor painting “Tropics 2”, I have captured the vibrant and explosive energy of the tropics. Like a tropical storm blowing across the paper, conveying both chaos and beauty through the splashes and strokes of water. Each color has been carefully chosen to represent warmth, nature and passion, bringing a dynamic presence to any space it is placed in. This piece is an invitation to embrace the wild and restless energy of living moments.', '498', '/uploads/1743055765120-630482307.png', '75x100cm', 'Watercolor on paper', 1, '2025-03-27 06:09:25', 7, 1),
(45, 'The Galaxy 2', 'In this abstract watercolor on paper, I wanted to capture the chaotic energy of a galaxy in motion. The swirls of light and dark represent the cosmic dance between nebulae and stars, alternating between serenity and chaos. The pops of turquoise and white amidst the darkness evoke distant celestial bodies. This work invites the viewer to explore the depths of the cosmos while bringing dynamism and excitement to any space.', '298', '/uploads/1743055856756-979053807.png', '75x100cm', 'Watercolor on paper', 1, '2025-03-27 06:10:56', 7, 1),
(46, 'Woman in the rain', 'In creating this piece, I wanted to capture the fleeting and ephemeral nature of emotion using abstract watercolor shapes. Shades of green, purple and yellow blend together to depict a serene yet elusive face, reminding us of the beauty and fleeting moments of life. This piece of art is a profound reflection of inner peace amidst chaos, perfect for adding a sense of contemplation and tranquility to any space.', '599', '/uploads/1743055985554-506429774.png', '75x55cm', 'Watercolor on paper', 1, '2025-03-27 06:13:05', 7, 1),
(47, 'The dance of the flames', 'In this acrylic painting, I explore the powerful energy of fire with expressive brushstrokes. Each movement, each swirl of vibrant orange, deep blue and vibrant black captures the uncontrollable dance of fire, a metaphor for the unpredictable rhythm of life. This piece is a celebration of passion and movement, intended to evoke a sense of wild freedom and dynamic change in your space, brightening any room with dynamic, fluid movement.', '399', '/uploads/1743056099089-774971216.jpeg,/uploads/1743056099093-493862894.jpeg,/uploads/1743056099095-242847028.jpeg', '80x120cm', 'Acrylic on canvas', 1, '2025-03-27 06:14:59', 7, 1),
(48, 'The Ocean 1', 'In this vibrant acrylic painting, I wanted to capture the wild energy and constant movement of the ocean. Each stroke is imbued with passion, using a bold expressionist style to evoke the ebb and flow of the tides and the dance of the waves under the changing light. This piece speaks to the beauty of chaos in nature, inviting the viewer to experience the rush and tranquility of the ever-moving ocean waters. It is an invitation to the dynamic and ever-changing nature of life, perfect for bringing a flow of energy and tranquility into your home.', '199', '/uploads/1743056199304-748279691.jpeg,/uploads/1743056199308-19751372.jpeg,/uploads/1743056199312-514092472.jpeg', '80x120cm', 'Acrylic on canvas', 1, '2025-03-27 06:16:39', 7, 1),
(49, 'Human', 'In this painting, I have captured the dynamic and powerful movement of life itself. I have used bold swirling strokes of red, blue and yellow acrylic to reflect the intense emotional and spiritual journey we all go through. This artwork represents human resilience and the fluidity of our experiences, creating a sense of shifting energy that will energize any space with its depth and profound movement.', '589', '/uploads/1743056295896-762462410.jpeg,/uploads/1743056295898-934514962.jpeg', '200x180cm', 'Acrylic on canvas', 1, '2025-03-27 06:18:15', 7, 1),
(50, 'La lisera 2023', 'Original drawing by Gustavo Leutun, done in acrylic pencil on paper. This large-scale work features many details that are typical of the artist, both in its unusual shape and its interpretation. To date, this is the artist\'s largest work of art.', '359', '/uploads/1743057121192-733311962.jpeg,/uploads/1743057121194-241491248.jpeg,/uploads/1743057121197-868983071.jpeg,/uploads/1743057121198-433316058.jpeg', '61x94cm', 'Colored pencils on paper', 3, '2025-03-27 06:32:01', 8, 1),
(51, 'La \"12\"', 'Although this may not be the first and only night scene I have painted so far. I find the lights of public transport and the contrast at night between the lights of the vehicles and the silhouettes of people fascinating, there is really a charm that I like and captivates me. I would like to paint more night scenes but I will use different colors. I hope to finish these ideas soon.', '329', '/uploads/1743057250765-296216366.jpeg,/uploads/1743057250767-309130360.jpeg,/uploads/1743057250771-5546930.jpeg,/uploads/1743057250773-292764547.jpeg', '77x107cm', 'Acrylic on canvas', 7, '2025-03-27 06:34:10', 8, 1),
(52, 'Maipu con Colon', 'The painting is inspired by the streets of Maipu with Colon Street in Arica-Chile. I feel different in this painting, I have wanted to paint this way for many years, the lines and brush strokes are soft colors on a pastel background that makes me reflect more on my technique every day. I think this painting reflects me very well and I really enjoy painting it.', '699', '/uploads/1743057381195-566558344.jpeg,/uploads/1743057381197-926906373.jpeg,/uploads/1743057381200-55946403.jpeg,/uploads/1743057381203-91000671.jpeg,/uploads/1743057381206-617655698.jpeg', '60x80cm', 'Acrylic on canvas', 4, '2025-03-27 06:36:21', 8, 1),
(53, '21 Pastel', 'The painting was painted in the center of Arica. The painting was based on a photo taken by the same author (G. Leutun). \"21 pastel\" represents a sunny day and to me, the colors used reflect the intensity of the light as well as the dynamism of people. I feel that it captures the most intense moment of the day and I can express it with strong colors.', '366', '/uploads/1743057482973-35001457.jpeg,/uploads/1743057482975-217613772.jpeg,/uploads/1743057482978-452229535.jpeg,/uploads/1743057482980-951969471.jpeg', '60x80cm', 'Acrylic on canvas', 4, '2025-03-27 06:38:02', 8, 1),
(54, 'mucho calipso', 'The semi-abstract work, in which Gustavo Leutun depicts people walking in the city center, I use a flat and strong background. This is one of the first collections to carry this painting trend.', '368', '/uploads/1743057574419-522361877.jpeg,/uploads/1743057574423-697528215.jpeg,/uploads/1743057574425-125634800.jpeg,/uploads/1743057574428-807877941.jpeg', '100x100cm', 'Acrylic on canvas', 4, '2025-03-27 06:39:34', 8, 1),
(55, '21 soleado', 'Original painting by Gustavo Leutun, based on a photograph by the same author. This work once again reflects Leutun\'s purest painting style.', '366', '/uploads/1743057679362-394926613.jpeg,/uploads/1743057679365-67422954.jpeg,/uploads/1743057679367-834051923.jpeg,/uploads/1743057679370-144419655.jpeg,/uploads/1743057679372-840739983.jpeg', ' 60x90cm', 'Acrylic on canvas', 4, '2025-03-27 06:41:19', 8, 1),
(56, '21 B&W', 'In this painting, Leutun uses hand-drawing technique - a unique way of drawing, a clean way of drawing that shows his unique drawing ability and style. This work is taken from a photo taken by Leutun himself.', '288', '/uploads/1743057878739-961310151.jpeg,/uploads/1743057878741-978305323.jpeg,/uploads/1743057878744-999100203.jpeg,/uploads/1743057878746-84504254.jpeg,/uploads/1743057878748-902601487.jpeg', '90x90cm', 'Acrylic on canvas', 4, '2025-03-27 06:44:38', 8, 1),
(57, 'Arica', 'In this new work, Gustavo Leutun uses drawings and acrylic paint. With deft strokes and pastels, he conveys the flow and movement of things, and through his painting, he shows us that he is completely confident in what he does. It is interesting to see Leutun, from a stage suspended in the air, giving us the feeling of being there, simply a unique work in its own right.', '2000', '/uploads/1743057969787-412530971.jpeg,/uploads/1743057969789-549682618.jpeg,/uploads/1743057969793-214773158.jpeg,/uploads/1743057969795-823772718.jpeg', '50x70cm', 'Acrylic on canvas', 4, '2025-03-27 06:46:09', 8, 1),
(58, 'Playa chinchorro', 'Based on a photo of the moon taken at Playa - Chinchorro located in the city of Arica, Chile. Original drawing by Gustavo Leutun', '1000', '/uploads/1743058118847-896334172.jpeg,/uploads/1743058118849-725642986.jpeg,/uploads/1743058118850-857942406.jpeg,/uploads/1743058118852-502364860.jpeg,/uploads/1743058118854-957691512.png', '21x29.5cm', 'Colored pencils on paper', 4, '2025-03-27 06:48:38', 8, 1),
(59, 'drawing girl 001', 'Gustavo Leutun\'s original drawing was done in acrylic pencil. With his own technique, you can see how he interprets what he sees more and more deeply. Using his own way of drawing, we see him further develop his technique towards the combination of irregular but at the same time very solid lines, this is a fast drawing method that requires absolute safety. Leutun does not feel attached to any trend; on the contrary, he does what he believes and thinks.', '988', '/uploads/1743058241474-906476452.png', '26,5x21,6cm', 'Colored pencils on paper', 4, '2025-03-27 06:50:41', 8, 1),
(60, 'Iris Hollandica', 'In this work, I have captured the living essence of the iris, using oil paint to bring out the vibrant shades and expressive contrasts. The elegant curves and vibrant light of the flower are a tribute to nature, bringing dynamic energy and sophistication to any space. It is an invitation to contemplate the beauty and complexity of the natural world.', '1399', '/uploads/1743058655669-303106822.png', '120x120cm', 'Oil on canvas', 5, '2025-03-27 06:57:35', 9, 1),
(61, 'Feuillée', 'In this work, I combine oil paints to bring to life a vibrant dance of color and form. The captivating shades, telling the story of nature and intertwined emotions, evoke deep resonance and visual dialogue. It is an invitation to immerse yourself in a world where the figurative meets the abstract, infusing your space with dynamic energy and lasting radiance.', '1299', '/uploads/1743058734040-346940516.png', '80x60cm', 'Oil on canvas', 5, '2025-03-27 06:58:54', 9, 1),
(62, 'Pivoine', 'In this work, I wanted to capture the sublime and ephemeral nature of flowers. Oil painting allows me to explore the depth of color and the sensuality of form. Each petal is a visual caress that envelops us in softness and mystery. The energy of this work lies in its invitation to an inner journey, a contemplative pause in the chaos of everyday life.', '1299', '/uploads/1743058802981-852350451.png', '130x120cm', 'Oil on canvas', 5, '2025-03-27 07:00:02', 9, 1),
(63, 'Plumage', 'In this piece, I have captured the vibrant nature and graceful beauty of feathers through oil paint, a medium that allows me to express their sumptuous texture. Each feather, bathed in rich color, represents individuality and unique beauty. All together creating a harmonious bouquet, celebrating diversity and unity. This figurative painting invites reflection on our own feathers - our unique identity and expression. It will bring positive energy and inspiration to any living space.', '1200', '/uploads/1743058868936-237383216.png', '100x160cm', 'Oil on canvas', 5, '2025-03-27 07:01:08', 9, 1),
(64, 'générations', 'In this piece, I have captured the essence of tradition and heritage. The oil on canvas painting reveals a velvet-covered table, where each object tells a story that has been told through generations. The ornate frame and shimmering fabric show a deep respect for the past, evoking nostalgia. This painting will infuse your space with rich historical energy, a living tribute to the continuity of time.', '1999', '/uploads/1743058938994-688925903.png', '100x160cm', 'Oil on canvas', 5, '2025-03-27 07:02:18', 9, 1),
(65, 'Gunman', 'In my art, I combine the rigor of realism with the dynamism of classical style. Using oil paint and pencil, I create images that exude strength and determination. Powerful poses, dramatic movements of light and shadow, capture a moment of eternal determination. This artwork will bring a sense of energy and timeless story to any room.', '3100', '/uploads/1743074301175-976244939.jpeg,/uploads/1743074301179-778524470.jpeg,/uploads/1743074301181-621504740.jpeg,/uploads/1743074301183-536805966.jpeg,/uploads/1743074301184-288076088.jpeg', '100x70cm', 'Oil, Pencil on Wood', 7, '2025-03-27 11:18:21', 10, 1),
(66, 'Prometheus – Die Entführung des göttliches Feuers', 'Prometheus, a Titan in Greek mythology, is known for stealing fire from the gods of Olympus and giving it to humans. This act made him one of the most important people who carried the culture in Greek mythology and symbolized the progress and civilization of mankind.', '2799', '/uploads/1743074412432-342060636.jpeg,/uploads/1743074412437-238702552.jpeg,/uploads/1743074412438-664561600.jpeg,/uploads/1743074412440-300647600.jpeg,/uploads/1743074412441-410858460.jpeg', '90x70cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:20:12', 10, 1),
(67, 'Apokalypto', 'In my work, I capture the raw, wild power of a moment of passion. The use of pencil, ink and colored pencil gives the image depth and almost tangible texture. Both symbolic and realistic, it evokes a classic feeling, as if stories from ancient times are being told. This piece of art will fill your home with an energy that reminds you of the unparalleled beauty and fighting spirit of nature.', '2099', '/uploads/1743074513719-277124213.jpeg,/uploads/1743074513722-437125951.jpeg,/uploads/1743074513723-255884815.jpeg,/uploads/1743074513724-131717928.jpeg', '70x120cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:21:53', 10, 1),
(68, 'Farm der Tiere - Napoleon (Animal Farm)', 'In this piece, I worked passionately with pencil, ink and colored pencil to create a style that is both realistic and nostalgic. With each line, I wanted to capture the seriousness and intensity of the main character. This drawing exudes strength and authority, intended to provoke discussion and reflection. It brings a captivating energy to any room that makes the viewer think.', '1899', '/uploads/1743074607790-732997639.jpeg,/uploads/1743074607793-452846994.jpeg,/uploads/1743074607796-22245861.jpeg,/uploads/1743074607797-110434820.jpeg', '90x70cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:23:27', 10, 1),
(69, 'Alle Tiere sind gleich - aber einige Tiere sind gleicher - George Orwell (All animals are equal - but some animals are more equal)', 'George Orwell\'s Animal Fables from 1945 is not a children\'s bedtime story, but rather a bitter and cruel fable about the origins of the Soviet Union. It is therefore understandable why the book was banned in the (former) German Democratic Republic and, like Orwell\'s novels in general, its possession could lead to criminal prosecution. All the animals on the farm, especially the main characters who later rebel against their increasingly neglectful and drunken master, have real-life role models. Of course, it is no coincidence that pigs play an important, even central role in this rebellion. Because pigs are...', '1088', '/uploads/1743074728680-891640543.jpeg,/uploads/1743074728682-881663096.jpeg,/uploads/1743074728684-602242425.jpeg', '90x70cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:25:28', 10, 1),
(70, 'Hermann Hesse', 'Hermann Hesse was one of the most important writers of the 20th century, whose works dealt with themes such as self-discovery, spirituality, and the search for meaning. Born in Calw in 1877, he grew up in a religious environment that marked his early years. After a personal crisis, he abandoned his theological career and turned to literature.', '999', '/uploads/1743074818775-721545430.jpeg,/uploads/1743074818777-123405247.jpeg,/uploads/1743074818780-253259052.jpeg,/uploads/1743074818782-591120575.jpeg', '70x100cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:26:58', 10, 1),
(71, 'Adenauer', 'This large-scale portrait of Adenauer is the beginning of a series of three (starting in the Kleinich-Moselle area) that I began as part of a workshop as an educational demonstration. My aim was to show the participants how I approach such projects. I then had to put the finishing touches in my home studio. Unfortunately, I did not take any photographs of the drawing process during the course. Konrad Adenauer, born 5 January 1876, was a prominent German politician and the first Chancellor of the Federal Republic of Germany. He had a significant influence on the post-war period and the reconstruction of Germany after World War II.', '989', '/uploads/1743074937950-925306944.jpeg,/uploads/1743074937952-492289784.jpeg,/uploads/1743074937955-621642238.jpeg', '100x70cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:28:57', 10, 1),
(72, 'Picasso', 'Pre-framed drawing, with backing, in Halbe brand magnetic frame.', '989', '/uploads/1743075026050-651981983.jpeg,/uploads/1743075026052-134401453.jpeg,/uploads/1743075026053-964937741.jpeg,/uploads/1743075026054-113868211.jpeg', '100x70cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:30:26', 10, 1),
(73, 'Mick Jagger', 'Mick Jagger, known as the frontman of the legendary band The Rolling Stones, is not only known for his musical career but also for his incredible vitality at the age of 80. He relies on a healthy lifestyle, regular physical activity and a balanced diet to stay in shape. This is quite different from Keith Richards, who still thinks he can write obituaries for all of us. Jagger\'s energy on stage is still extremely impressive. As for her relationship with Keith Richards, the two have a long and complicated history. As founding members of the Rolling Stones, they have been through many ups and downs together.', '989', '/uploads/1743075115733-335505098.jpeg,/uploads/1743075115747-920223074.jpeg,/uploads/1743075115750-914252678.jpeg,/uploads/1743075115752-649715025.jpeg,/uploads/1743075115753-921541769.jpeg', '70x100cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:31:55', 10, 1),
(74, 'Auf dem Dach einer Stadt (On the roof of a city)', 'In my work, I capture the silence and contemplation hidden in the solitude of a city rooftop. Using pencil, ink and colored pencil, I work on small details to create a classic realism atmosphere. The hunched and pensive statue represents the human quest for inner peace amidst the cold of the city. The design brings a deep, authentic energy to any home and invites you to linger and reflect.', '1099', '/uploads/1743075223337-51105053.jpeg,/uploads/1743075223339-45542231.jpeg,/uploads/1743075223341-20885589.jpeg,/uploads/1743075223342-285152945.jpeg', '120x45cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:33:43', 10, 1),
(75, 'Thomas O´Malley', 'In my work, I combine figurative and realist elements with a touch of the classic. The use of pencil, ink, colored pencil and charcoal reflects careful craftsmanship. This majestic cat image is surrounded by mysterious shadows and has a rich texture that arouses curiosity. The interplay of light and shadow captivates the viewer, while the deep layers of emotion prompt reflection. This design will bring strong attraction and sensuality to any room.', '999', '/uploads/1743075308919-733851667.jpeg,/uploads/1743075308921-525947029.jpeg,/uploads/1743075308924-1885919.jpeg', '90x70cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:35:08', 10, 1),
(76, 'Genesis', 'In this piece, pencil, ink, and colored pencil come together to create a simple, elegant scene. Using realistic details and a touch of nostalgia, I have created a world full of depth and emotion, capturing the connection between man and nature. It fills the room with a sense of hope and timeless beauty.', '1059', '/uploads/1743075394897-797936832.jpeg,/uploads/1743075394898-890618466.jpeg,/uploads/1743075394901-556364731.jpeg,/uploads/1743075394903-534367430.jpeg', '60x90cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:36:34', 10, 1),
(77, 'The Unbearableness of the Moment', 'In my drawing, I have captured the fleeting nature of human experience and the intensity of a single moment. Using pen, ink and colored pencil, I have created a scene in a trench coat; The realistically shaped figures and classic colors give the piece a vivid authenticity. This piece is about deprivation and camaraderie, capturing the emotional depth and drama of historical moments. It will develop a strong and emotional presence in any room.', '1099', '/uploads/1743076324259-444601591.jpeg,/uploads/1743076324260-908410438.jpeg,/uploads/1743076324263-627465514.jpeg,/uploads/1743076324265-232447082.jpeg', '60x90cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:52:04', 10, 1),
(78, 'Speicherstadt - bei St. Annen (Hamburg)', 'Other framing options available upon request This motif was drawn in pen on some old historical cadastral papers from the 19th century, bound into the final format seen here with museum tape.', '1799', '/uploads/1743076433279-430716510.jpeg,/uploads/1743076433281-546159967.jpeg,/uploads/1743076433284-454870530.jpeg,/uploads/1743076433285-507884680.jpeg,/uploads/1743076433286-283246725.jpeg', '60x90cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:53:53', 10, 1),
(79, 'Deutsches Schauspielhaus - Hamburg', 'In my art, I use pen, ink and colored pencils to weave together the beauty and aura of historic architecture, in this case the Deutsches Schauspielhaus in Hamburg. This artwork reflects my deep admiration for the attention to detail and spirit of a bygone era. Through realistic and figurative representation, I capture the vibrancy and cultural heritage and bring them to life on paper. With this work, I bring the elegance and inspiring atmosphere of the theater to any environment.', '1799', '/uploads/1743076746417-927499194.jpeg,/uploads/1743076746420-627092126.jpeg,/uploads/1743076746422-285659435.jpeg,/uploads/1743076746423-133062934.jpeg', '60x90cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 11:59:06', 10, 1),
(80, 'Die Krönung Satans', 'This new, lavish large-scale pencil drawing is based on the Flemish Baroque style in composition and color, and is thematically inspired by John Milton\'s famous story of the angels rebelling against God, the great battle in heaven, and the subsequent overthrow of the leader Satan and his followers from God\'s kingdom in his epic poem \"Paradise Lost\" of 1667. Lucifer (also known as the Lightbringer) falls into the hands of Satan himself, who is banished to hell by the Archangel Michael during the battle. It is important to note that Milton takes artistic liberties in his work to make his own interpretations and additions to the biblical stories. As a result, his depiction of Satan and Lucifer may differ from traditional theological interpretations. For, as in the context of \"The Seven Deadly Sins\", Satan cannot be equated with Lucifer, whereas in the theological context...', '4449', '/uploads/1743076878482-823997822.jpeg,/uploads/1743076878485-941334963.jpeg,/uploads/1743076878490-956189852.jpeg,/uploads/1743076878491-434322341.jpeg,/uploads/1743076878494-849804360.jpeg', '90x90cm', 'Pencil, ink on paper, composite plate under glass', 3, '2025-03-27 12:01:18', 10, 1),
(81, 'Cello in Momentum', 'In my oil painting, I have captured the deep devotion and dynamic movement of a cellist. The nostalgic feeling blends with the contemporary vitality and emphasizes the eternal beauty of musical expression. This combination creates an elegant and passionate atmosphere, and will bring unprecedented energy and inspiration to the room.', '3599', '/uploads/1743076987187-664082183.jpeg,/uploads/1743076987190-131194987.jpeg,/uploads/1743076987192-916709588.jpeg,/uploads/1743076987193-272903390.jpeg', '100x100cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 12:03:07', 10, 1),
(82, 'Kerberos', 'Beautiful hand-signed and numbered art prints by Hahnemühle, printed by leading supplier White Wall, in limited editions!', '999', '/uploads/1743077075940-4871688.jpeg,/uploads/1743077075942-907935461.jpeg,/uploads/1743077075945-191430431.jpeg,/uploads/1743077075945-796216377.jpeg', '90x90cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 12:04:35', 10, 1),
(83, 'Hexenzank (f. n. Caprichos No. 62)', 'Other framing options available upon request!', '3299', '/uploads/1743077241847-881322635.jpeg,/uploads/1743077241848-943289740.jpeg,/uploads/1743077241849-920337198.jpeg,/uploads/1743077241850-917488925.jpeg', ' 120x90cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 12:07:21', 10, 1),
(84, 'Die Auferstandenen (n. Goyas Capricho No. 59 - Und noch immer gehen Sie nicht fort)', 'In my art, I combine the past and present in a vibrant interplay of light and shadow. Using pastels, pencils and inks, I bring to life figures hidden deep in collective memory, while posing timeless questions. They embody the eternal struggle and hope of humanity. This work is imbued with realism and classicism, aiming to touch the viewer\'s heart and make them think. It will bring a powerful energy and a touch of nostalgia to any home.', '3229', '/uploads/1743077324137-804254270.jpeg,/uploads/1743077324139-951030592.jpeg,/uploads/1743077324141-5209356.jpeg,/uploads/1743077324143-526608998.jpeg', '120x90cm', 'Pencil, ink on paper, composite plate under glass', 7, '2025-03-27 12:08:44', 10, 1),
(85, 'La perle du bassin II', 'In this piece, I have captured the ephemeral beauty of a pond of flowers. Using oil paint allows me to create intense depth, reflecting the complexity of human emotions. Each brushstroke is an invitation to immerse yourself in a world of silence and inner reflection. This painting will bring a calm energy and a meditative charm to your home.', '1000', '/uploads/1743078198166-427661767.jpeg,/uploads/1743078198168-663668783.jpeg,/uploads/1743078198170-657326034.jpeg,/uploads/1743078198173-243164331.jpeg,/uploads/1743078198173-806956928.png', '100x81cm', 'Oil on canvas', 2, '2025-03-27 12:23:18', 11, 1),
(86, 'Joie du printemps', 'In this oil painting, I have captured the vibrant essence of spring renewal. Each stroke represents the freshness and awakening of nature in an impressionistic style. I wanted to encapsulate the feeling of joy and serenity that the blooming flowers and the reflection of the water bring. This work is a hymn to life, bringing a dynamic and calm energy to any space.', '1299', '/uploads/1743078299800-84784972.jpeg,/uploads/1743078299803-159654016.jpeg,/uploads/1743078299805-339317253.jpeg,/uploads/1743078299806-651516300.jpeg,/uploads/1743078299807-268161381.jpeg', '81x100cm', 'Oil on canvas', 2, '2025-03-27 12:24:59', 11, 1),
(87, 'Reflets de printemps II', 'In this work, created with passion, oil paint becomes the medium to convey my impressionistic vision. I wanted to capture the essence of spring, its vibrant palette and its eternal renewal. The reflections on the water are a poetic dance between reality and illusion, inviting serene contemplation. This vibrant painting will bring harmonious spring energy into your home.', '1199', '/uploads/1743078416813-580717023.jpeg,/uploads/1743078416814-697844790.jpeg,/uploads/1743078416816-620036092.jpeg,/uploads/1743078416819-105694916.jpeg,/uploads/1743078416820-938947494.png', '100x81cm', 'Oil on canvas', 5, '2025-03-27 12:26:56', 11, 1),
(88, 'Vingt Printemps', 'In this piece, I have captured the fleeting nature of spring, with butterflies in flight, creating a symphony of freedom. Using pastels and ink, on a white paper background, I wanted to express rebirth and transformation, symbolized by these fragile creatures. Each stroke carries hope and joy, bringing freshness to your home with a touch of inspiring serenity.', '1449', '/uploads/1743078503333-983170994.jpeg,/uploads/1743078503335-402986696.jpeg,/uploads/1743078503336-83554928.jpeg', '100x70cm', 'Oil on canvas', 2, '2025-03-27 12:28:23', 11, 1),
(89, 'Instant Majorelle V', 'The fifth work of the \"Instant Majorelle\" is dedicated to this creation, in which two vases compete in color: the brick tones of the Moroccan soil and Majorelle blue, the symbolic color of this garden.', '1669', '/uploads/1743078641740-986218280.jpeg,/uploads/1743078641742-898227102.jpeg,/uploads/1743078641744-107713104.jpeg', '70x70cm', 'Oil on canvas', 6, '2025-03-27 12:30:41', 11, 1),
(90, 'Hommage à Yves-Saint-Laurent III', 'In this pastel on paper work, I capture the essence of life and the vibrant beauty of nature. I infuse each pencil stroke with my passion for lush flora and fauna and vibrant vegetation. This work will bring a breath of fresh air and positive energy to any space, inspiring joy and serenity to those around it. This work is a wonderful tribute to the natural world, inviting the viewer to wander into the serenity of a paradise garden.', '1588', '/uploads/1743078838464-820392749.jpeg,/uploads/1743078838467-588009640.jpeg,/uploads/1743078838470-230241119.jpeg,/uploads/1743078838473-54763154.jpeg', '70x100cm', 'Oil on canvas', 6, '2025-03-27 12:33:58', 11, 1),
(91, 'Bouquet de coquelicots', 'Discover this expressionist painting of poppies, created using a mixed technique of acrylic and oil. The artist explores vibrant colors and suggestive shapes to capture the effervescence and vitality of these flowers. The bouquet, composed with luminous energy and a breath of fresh air, brings a unique artistic touch to any interior.', '299', '/uploads/1744218560188-679062574.jpeg,/uploads/1744218560193-455960224.jpeg,/uploads/1744218560198-148539781.jpeg,/uploads/1744218560201-175628602.jpeg', '55x46cm', 'Acrylic, Oil on Canvas', 6, '2025-04-09 17:09:20', 5, 0),
(92, 'Le roi de la basse-cour', 'Digital painting produced with graphic design software and a graphics tablet while preserving the artist\'s graphic style.\r\nThe work represents a rooster and is presented to you in a limited edition of 30 copies.', '199', '/uploads/1744218677254-984010451.jpeg,/uploads/1744218677287-602804101.jpeg,/uploads/1744218677289-789382776.jpeg', '90x70cm', 'Acrylic on canvas', 5, '2025-04-09 17:11:17', 5, 2),
(93, 'Leslie Left', 'Gustavo Leutun original painting. Based on a photo captured by the same author. You can see the awakening in her way of using color with a loose brushstroke that accompanies the expression of the model (Leslie).', '399', '/uploads/1744218769791-669250248.jpeg', '90x70cm', 'Acrylic on canvas', 3, '2025-04-09 17:12:49', 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Abstract'),
(2, 'Realism'),
(3, 'Impressionism'),
(4, 'Minimalism'),
(5, 'Expressionism'),
(6, 'Cubism'),
(7, 'Surrealism');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `order_date` datetime NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `note` text DEFAULT NULL,
  `code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `users_id`, `order_date`, `total_amount`, `status`, `phone`, `address`, `note`, `code`) VALUES
(21, 33, '2025-04-12 18:46:48', 1619.76, 3, '0233457791', 'ct\n', '', 'TN56'),
(22, 33, '2025-04-12 18:59:22', 3322.14, 2, '0233457791', 'ffff', '', 'QN18'),
(25, 33, '2025-04-14 14:17:13', 11573.94, 0, '0233457791', 'can tho', '', 'LR16');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `orders_id` int(11) NOT NULL,
  `artworks_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `orders_id`, `artworks_id`, `quantity`, `price`) VALUES
(43, 21, 90, 1, 1588.00),
(44, 22, 90, 1, 1588.00),
(45, 22, 89, 1, 1669.00),
(49, 25, 80, 1, 4449.00),
(50, 25, 81, 1, 3599.00),
(51, 25, 83, 1, 3299.00);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'buyer'),
(3, 'artists');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `phone`, `role_id`, `profile_picture`) VALUES
(14, 'thuy', 'thuy@gmail.com', '$2b$10$Onpdm.kFbySQkZV8/cxKd.yMbp7d9V7B5wjxMyv19miNAVp7Uh3sy', '0981168449', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ddd4f480bd5f3ddb561ae1b70ba60f74.jpg-vUVSpHHeLlxmcEvpxk58tlQ0NcjzmJ.jpeg'),
(20, 's', 'syx@g.com', '$2b$10$F.KrYw1RXXl8m18FLTOywOeBW8/o3RBFENhCKX0Rzme5ZEns5FEHO', '0981168449', 1, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c1e2678fffcde71a14a6856a158b7f62.jpg-DJ9qDwQWbkE0TQ1JvfGUzFHork4LHZ.jpeg'),
(24, 'Aelita Andre', 'aandre12@gmail.com', '$2b$10$HccGaqMfbIPIID3sdQAqJ.26sbcMSdnZ/I0.Y6vseRzttxvNN.CDK', '0981167763', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1ac312780e071afd063527c1c01a529a.jpg-tPMnub1HOSVHAafeFPmWetqEqMQCpf.jpeg'),
(25, 'Eric Bruni', 'ericbruni@g.com', '$2b$10$c6.Ex/SnvguPAL4.41gxyOpWSrxJpoka0M6eaQ0WCQACcwSp9Ydne', '0321456995', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ec5247c993852fe0ffdfe82102e570c5.jpg-2mtfJCZyOcNCfhqRsHXUEXw0zH8LJF.jpeg'),
(26, 'Khanh Bui', 'khanhbui@g.com', '$2b$10$qcZOrVrPt68LltvXExaY.edQKrK32PFvwd6FKq0wzjALawwSNuEla', '0321456995', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c65b4aa73ee5c8c9ec8bfb641b4175b2.jpg-aQGgn3lkCh3JNvkoJ0fz3roVLqwspd.jpeg'),
(27, 'Duong Bui', 'duongbui@g.com', '$2b$10$8/ylQ8FxZ6ynHwfmHm0cZ.DHutjaSoQu.kC.qsDxV5.AFkgCqlUUW', '0981345679', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d19c143d61847e8bcfb5983b7af4cf63.jpg-HLiMIOtXvdsdtBYmdkwvfPWRmJ4ro9.jpeg'),
(28, 'Gustavo Leutun', 'gustavo@g.com', '$2b$10$RT4oyyljS8GL2IOLweTgWOUiB.Ql0TqBthLeTNIFG9S/yDN/1PV8y', '0233457791', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eed4b615981b421f8a6eb50ee3cd1e12.jpg-IRwpFPHr8eU8VTSsayIinOTDeF07El.jpeg'),
(29, 'Nadia Abbadi', 'nadia@g.com', '$2b$10$9BzAXerbqxk7nD60nn5rhOVwcld0J01mJKvQbKRonlwfiwo.inW0m', '0981168448', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9653cdef422295a55df52506fc108e57.jpg-b0YqoycdYYgyqjF9cQKlH2JrRihDmx.jpeg'),
(30, 'Andreas Noßmann', 'andress@g.com', '$2b$10$yBn2DDlOgWv4xq0d3nqB7ePtrqvn4N/iyW49Sxrwe0wEKseTV2Rdm', '0981168449', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/330f9833fabd7fc13d9ebe8c1b4016e1.jpg-NgtVa8JGbkyTMDvMzkEZYmoXc2gHpR.jpeg'),
(31, 'Agnès Tiollier', 'tiollier@g.com', '$2b$10$/RADknXW8gMDC/lgbnaaJuF2quxOyYhEm6gMQJRATZnJKv9zfB9Ku', '0321456995', 3, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/00abd9564318bcd03abeeda380f08b19.jpg-2Em6wCURIlkKYop0himKp55YAzhPOa.jpeg'),
(32, 'nhan', 'nhan@g.com', '$2b$10$zGXsCVR8N/697Axo28aziuZxol7TtHUnWfvNESEnz/I0S7kmv/lmm', '0321456995', 2, NULL),
(33, 'thu', 'thu@g.com', '$2b$10$Sg2R/92SqL8WpW/ivBbEh.uXf8BrufOIqjALZ.oD7v8V0dqziNfmm', '0233457791', 2, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1ac312780e071afd063527c1c01a529a.jpg-tPMnub1HOSVHAafeFPmWetqEqMQCpf.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`users_id`);

--
-- Indexes for table `artworks`
--
ALTER TABLE `artworks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`,`artists_id`),
  ADD KEY `users_id` (`artists_id`),
  ADD KEY `artists_id` (`artists_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`users_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artworks_id` (`artworks_id`),
  ADD KEY `order_details_ibfk_1` (`orders_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `artworks`
--
ALTER TABLE `artworks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artists`
--
ALTER TABLE `artists`
  ADD CONSTRAINT `artists_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `artworks`
--
ALTER TABLE `artworks`
  ADD CONSTRAINT `artworks_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `artworks_ibfk_2` FOREIGN KEY (`artists_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`artworks_id`) REFERENCES `artworks` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
