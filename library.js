/*
 *****************************************************************************
 *                                                                           *
 *                     Bitmap Image Reader Writer Library                    *
 * OpenGL Texture-Map                                                        *
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


#ifndef INCLUDE_TEXTURE_HPP
#define INCLUDE_TEXTURE_HPP

#include <string>
#include <GL/glu.h>

#include "bitmap_image.hpp"


class texture
{
public:

   texture(const std::string& texture_file_name)
   : texture_id_(0),
     texture_file_name_(texture_file_name)
   {
      bitmap_image tmp(texture_file_name_);

      if (!tmp)
      {
         std::cerr << "texture() - Failed to load bitmap texture " << texture_file_name << std::endl;
         return;
      }

      texture_.setwidth_height(next_power_of_2(tmp.width()),next_power_of_2(tmp.height()));

      if (!texture_.copy_from(tmp,0,0))
      {
         std::cout << "texture() - Failed to initialise texture " << texture_file_name << std::endl;
         return;
      }

      texture_.reverse_channels();

      x_ratio_ = (1.0 * tmp. width()) / (1.0 * texture_. width());
      y_ratio_ = (1.0 * tmp.height()) / (1.0 * texture_.height());

      init_gl();
   }

   inline bool operator!()
   {
      return (0 == texture_id_);
   }

   GLuint texture_id() const
   {
      return texture_id_;
   }

   double x_ratio() const
   {
      return x_ratio_;
   }

   double y_ratio()
   {
      return y_ratio_;
   }

   std::string file_name()
   {
      return texture_file_name_;
   }

private:

   void init_gl()
   {
      glPixelStorei(GL_UNPACK_ALIGNMENT, 1);

      glGenTextures(1, &texture_id_);

      glBindTexture(GL_TEXTURE_2D, texture_id_);

      glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
      glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
      glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
      glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);

      glTexImage2D(GL_TEXTURE_2D,
                   0,
                   GL_RGB,
                   texture_.width(),
                   texture_.height(),
                   0,
                   GL_RGB,
                   GL_UNSIGNED_BYTE,
                   texture_.data());

      if (!obtain_OGL_error_status())
      {
         texture_id_ = 0;
      }
   }

   bool obtain_OGL_error_status()
   {
      GLenum error_code;
      const GLubyte* error_string;

      if (GL_NO_ERROR != (error_code = glGetError()))
      {
         error_string = gluErrorString(error_code);

         std::cerr << "OpenGL Error: "<<  error_string << std::endl;

         return false;
      }

      return true;
   }

   unsigned int next_power_of_2(const unsigned int& value)
   {
      unsigned int power = 2;

      for (std::size_t i = 0; i < 32; ++i)
      {
         if (value <= power)
            return power;
         else
            power <<= 1;
      }

      return power;
   }

   GLuint texture_id_;
   double x_ratio_;
   double y_ratio_;
   std::string texture_file_name_;
   bitmap_image texture_;
};

#endif
