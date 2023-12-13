\\\\\\Simple Example 5 - Magnifying Lens Distortion
The following example will render a baseline image using a combination of plasma and checkerpattern effects. 
Then proceed to apply a lens distortion upon the base image.
Finally both the base and the lens distorted versions of the images will be saved to file as 'base.bmp' and 'lens_effect.bmp' respectively./////

/*
 *****************************************************************************
 *                                                                           *
 *                     Bitmap Image Reader Writer Library                    *
 * Simple Example 05 - Magnifying Lens Distortion                            *
 * Author: Arash Partow - 2002                                               *
 * URL: http://partow.net/programming/bitmap/index.html                      *
 *                                                                           *
 * Note: This library only supports 24-bits per pixel bitmap format files.   *
 *                                                                           *
 * Copyright notice:                                                         *
 * Free use of the Platform Independent Bitmap Image Reader Writer Library   *
 * is permitted under the guidelines and in accordance with the most current *
 * version of the MIT License.                                               *
 * http://www.opensource.org/licenses/MIT                                    *
 *                                                                           *
 *****************************************************************************
*/


#include <algorithm>
#include <cmath>
#include "bitmap_image.hpp"

int main()
{
   bitmap_image base(600,600);

   base.clear();

   {
      const double c1 = 0.8;
      const double c2 = 0.4;
      const double c3 = 0.2;
      const double c4 = 0.6;

      ::srand(0xA5AA5AA5);

      plasma(base, 0, 0, base.width(), base.height(), c1, c2, c3, c4, 3.0, jet_colormap);

      checkered_pattern(30, 30, 230, bitmap_image::  red_plane, base);
      checkered_pattern(30, 30,   0, bitmap_image::green_plane, base);
      checkered_pattern(30, 30, 100, bitmap_image:: blue_plane, base);
   }

   bitmap_image lens_image(base.width(),base.height());

   lens_image = base;

   const double lens_center_x = base.width () / 2.0;
   const double lens_center_y = base.height() / 2.0;
   const double lens_radius   = std::min(base.width(), base.height()) / 4.0;
   const double lens_factor   = 0.7;

   for (unsigned int y = 0; y < base.height(); ++y)
   {
      for (unsigned int x = 0; x < base.width(); ++x)
      {
         const double dx = x - lens_center_x;
         const double dy = y - lens_center_y;

         const double distance = std::sqrt((dx * dx) + (dy * dy));

         if (distance <= lens_radius)
         {
            const double radius     = distance / lens_radius;
            const double angle      = std::atan2(dy, dx);
            const double distortion = std::pow(radius, lens_factor) * distance;

            int sx = static_cast<int>(distortion * std::cos(angle) + lens_center_x);
            int sy = static_cast<int>(distortion * std::sin(angle) + lens_center_y);

            if (
                 (sx >= 0)                 &&
                 (sy >= 0)                 &&
                 (sx < (int)base.width ()) &&
                 (sy < (int)base.height())
               )
            {
               unsigned char   red;
               unsigned char green;
               unsigned char  blue;

               base      .get_pixel(sx, sy, red, green, blue);
               lens_image.set_pixel( x,  y, red, green, blue);
            }
         }
      }
   }

   base      .save_image("base.bmp"       );
   lens_image.save_image("lens_effect.bmp");

   return 0;
}
