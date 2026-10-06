import { defineStore } from "pinia";
import UmkmProfileApi from "@/api/umkm";

export const useUmkmProfileStore = defineStore("umkmProfile", {
  state: () => ({
    profile: {
      id: null,
      user_id: null,
      kecamatan_id: null,
      nama_umkm: '',
      deskripsi: '',
      alamat: '',
      telepon: '',
      foto_logo: null,
      is_approved: false,
      user: {
        name: '',
        email: ''
      },
      kecamatan: null,
      products_count: 0,
      orders_count: 0
    },
    kecamatans: [],
    statistics: {
      total_products: 0,
      total_orders: 0,
      total_revenue: 0,
      pending_orders: 0
    },
    loading: false,
    updating: false
  }),

  actions: {
    async fetchProfile() {
      this.loading = true;
      try {
        const { data } = await UmkmProfileApi.getUmkmProfile();
        this.profile = data.data || data;

        // Process image URL if exists
        if (this.profile.foto_logo) {
          this.profile.foto_logo = this.processImageUrl(this.profile.foto_logo);
        }

        return this.profile;
      } catch (e) {
        console.error("Gagal fetch profile:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchKecamatans() {
      try {
        const { data } = await UmkmProfileApi.getKecamatans();
        this.kecamatans = data.data || data;
        return this.kecamatans;
      } catch (e) {
        console.error("Gagal fetch kecamatans:", e);
        throw e;
      }
    },

    async fetchStatistics() {
      try {
        const { data } = await UmkmProfileApi.getUmkmStatistics();
        this.statistics = data;
        return this.statistics;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async updateProfile(profileData) {
      this.updating = true;
      try {
        const formData = new FormData();

        formData.append('_method', 'PUT');

        const { data } = await UmkmProfileApi.updateUmkmProfile(formData);
        const updatedProfile = data.data || data;

        // Process image URL if exists
        if (updatedProfile.foto_logo) {
          updatedProfile.foto_logo = this.processImageUrl(updatedProfile.foto_logo);
        }

        this.profile = { ...this.profile, ...updatedProfile };
        return updatedProfile;
      } catch (e) {
        console.error("Gagal update profile:", e);
        throw e;
      } finally {
        this.updating = false;
      }
    },

    processImageUrl(fotoPath) {
      if (!fotoPath) return null;

      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
      const cleanPath = fotoPath.replace(/^storage\//, '')
      return `${baseUrl}/storage/${cleanPath}`
    },

    reset() {
      this.profile = {
        id: null,
        user_id: null,
        kecamatan_id: null,
        nama_umkm: '',
        deskripsi: '',
        alamat: '',
        telepon: '',
        foto_logo: null,
        is_approved: false,
        user: {
          name: '',
          email: ''
        },
        kecamatan: null,
        products_count: 0,
        orders_count: 0
      };
      this.kecamatans = [];
      this.loading = false;
      this.updating = false;
    }
  },

  getters: {
    isProfileLoaded: (state) => state.profile.id !== null,
    isApproved: (state) => state.profile.is_approved,
    hasLogo: (state) => !!state.profile.foto_logo,
    fullProfile: (state) => ({
      ...state.profile,
      kecamatan_name: state.profile.kecamatan?.nama_kecamatan || 'Belum dipilih'
    })
  }
});
