
  function variantPicker(Varient_json) {
    return {
      variants: Varient_json,
      selectedOptions: {},
      selectedVariantId: null,

      updateUrl(variantsList) {
        const urlParams = new URLSearchParams(window.location.search);
        const variantIdFromUrl = urlParams.get('variant');

        if (variantIdFromUrl) {
          const matchedVariant = this.variants.find((variant) => variant.id.toString() === variantIdFromUrl);

          if (matchedVariant) {
            this.setVariantOptions(matchedVariant);
          }
        } else {
          const defaultVariant = this.variants.find((variant) => variant.available);
          if (defaultVariant) {
            this.setVariantOptions(defaultVariant);
          }
        }
      },

      setVariantOptions(variant) {
        variant.options.forEach((value, index) => {
          this.selectedOptions[index + 1] = value;
        });
        this.updateSelectedVariant();
      },

      selectOption(optionPosition, value) {
        this.selectedOptions[optionPosition] = value;
        this.updateSelectedVariant();
        this.updateUrl();
      },

      updateSelectedVariant() {
        const matchedVariant = this.variants.find((variant) =>
          variant.options.every((option, index) => option === this.selectedOptions[index + 1])
        );

        if (matchedVariant && matchedVariant.available) {
          this.selectedVariantId = matchedVariant.id;
          const newUrl = new URL(window.location);
          newUrl.searchParams.set('variant', matchedVariant.id);
          window.history.replaceState(null, '', newUrl);
          document.querySelector('#varientIdHandler').value = matchedVariant.id;
        } else {
          this.selectedVariantId = null;
        }
      },
    };
  }
